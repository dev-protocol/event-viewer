import { Context } from '@azure/functions'
import { ObjectType } from 'typeorm'
import { EventSaverLogging } from './notifications'
import { DbConnection, Transaction } from './db/common'
import { EventTableAccessor } from './db/event'
import { ContractInfoAccessor } from './db/contract-info'
import { Event } from './block-chain/event'
import { getApprovalBlockNumber } from './block-chain/utils'
/* eslint-disable @typescript-eslint/no-var-requires */
const Web3 = require('web3')

export abstract class EventSaver {
	private readonly _db: DbConnection
	private readonly _context: Context
	private readonly _myTimer: any

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
			this._context.log.error(err.stack)
			await logging.error(err.message)
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
		const contractInfo = await this._getContractInfo()
		const web3 = new Web3(
			new Web3.providers.HttpProvider(process.env.WEB3_URL!)
		)
		const approvalBlockNumber = await getApprovalBlockNumber(web3)
		const event = new Event(web3)
		this._context.log.info(
			'target contract address:' + contractInfo.get('contract_info_address')
		)
		await event.generateContract(
			JSON.parse(contractInfo.get('contract_info_abi')),
			contractInfo.get('contract_info_address')
		)
		const events = await event.getEvent(
			this.getEventName(),
			Number(maxBlockNumber) + 1,
			approvalBlockNumber
		)
		return events
	}

	private async _getContractInfo(): Promise<Map<string, string>> {
		const contractInfoAccessor = new ContractInfoAccessor(this._db.connection)
		const info = await contractInfoAccessor.getContractInfo(
			this.getContractName()
		)
		return new Map(Object.entries(info))
	}

	abstract getModelObject<Entity>(): ObjectType<Entity>
	abstract getBatchName(): string
	abstract getContractName(): string
	abstract getSaveData(event: Map<string, any>): any
	abstract getEventName(): string
}
