/* eslint-disable @typescript-eslint/camelcase */
import { Context } from '@azure/functions'
import { ObjectType } from 'typeorm'
import { EventSaverLogging } from './notifications'
import { EventTableAccessor, DbConnection, Transaction } from './db'
import { getApprovalBlockNumber, Event } from './block-chain'

export abstract class EventSaver {
	private readonly _db: DbConnection
	private readonly _context: Context
	private readonly _myTimer: any

	// eslint-disable-next-line @typescript-eslint/no-untyped-public-signature
	constructor(context: Context, myTimer: any) {
		this._context = context
		this._myTimer = myTimer
		this._db = new DbConnection(this.getBatchName())
	}

	public async execute(): Promise<void> {
		const logging = new EventSaverLogging(
			this._context.log,
			this.getBatchName()
		)
		try {
			await logging.start()
			if (this._myTimer.IsPastDue) {
				await logging.warning('Timer function is running late!')
			}

			await this._db.connect()
			const events = await this._getEvents()
			if (events.length !== 0) {
				await this._saveEvents(events)
				await logging.info('save ' + String(events.length) + ' data')
			}
		} catch (err) {
			await this._notificationError(err, logging)
			throw err
		} finally {
			try {
				await this._db.quit()
			} catch (quitErr) {
				this._context.log.error(quitErr)
			}
		}

		await logging.finish()
	}

	private async _notificationError(
		err: Error,
		logging: EventSaverLogging
	): Promise<void> {
		try {
			let desctiption = err.stack
			if (typeof desctiption === 'undefined') {
				desctiption = err.message
			}

			await logging.error(desctiption)
		} catch (nexteErr) {
			this._context.log.error(err)
			this._context.log.error(nexteErr)
		}
	}

	private async _saveEvents(events: Array<Map<string, any>>): Promise<void> {
		const eventTable = new EventTableAccessor(
			this._db.connection,
			this.getModelObject()
		)
		const transaction = new Transaction(this._db.connection)
		try {
			await transaction.start()
			for (let event of events) {
				const eventMap = new Map(Object.entries(event))
				// eslint-disable-next-line no-await-in-loop
				const hasData = await eventTable.hasData(eventMap.get('id'))
				if (hasData) {
					throw Error('Data already exists.')
				}

				const saveData = this.getSaveData(eventMap)
				saveData.event_id = eventMap.get('id')
				saveData.block_number = eventMap.get('blockNumber')
				saveData.log_index = eventMap.get('logIndex')
				saveData.transaction_index = eventMap.get('transactionIndex')
				saveData.raw_data = JSON.stringify(event)

				// eslint-disable-next-line no-await-in-loop
				await transaction.save(saveData)
			}

			await transaction.commit()
		} catch (err) {
			await transaction.rollback()
			throw err
		} finally {
			await transaction.finish()
		}
	}

	private async _getEvents(): Promise<Array<Map<string, any>>> {
		const eventTable = new EventTableAccessor(
			this._db.connection,
			this.getModelObject()
		)
		const maxBlockNumber = await eventTable.getMaxBlockNumber()
		const contractJson = this.getAbi()
		const approvalBlockNumber = await getApprovalBlockNumber()
		const event = new Event()
		await event.generateContract(contractJson, this.getContractAddress())
		const events = await event.getEvent(
			this.getEventName(),
			Number(maxBlockNumber) + 1,
			approvalBlockNumber
		)
		return events
	}

	abstract getModelObject<Entity>(): ObjectType<Entity>
	abstract getContractAddress(): string
	abstract getBatchName(): string
	// eslint-disable-next-line @typescript-eslint/no-untyped-public-signature
	abstract getAbi(): any
	// eslint-disable-next-line @typescript-eslint/no-untyped-public-signature
	abstract getSaveData(event: Map<string, any>): any
	abstract getEventName(): string
}
