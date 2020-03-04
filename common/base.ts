import { Context } from "@azure/functions"
import { ObjectType } from 'typeorm'
import { EventSaverLogging } from './notifications'
import { EventTableAccessor, DbConnection, Transaction } from './db'
import { getApprovalBlockNumber, Event } from './block-chain'

export abstract class EventSaver {
	private _db: DbConnection
	private _context: Context
	private _myTimer: any

	constructor(context: Context, myTimer: any) {
		this._context = context
		this._myTimer = myTimer
		this._db = new DbConnection()
	}

	public async execute(): Promise<void> {
		const logging = new EventSaverLogging(this._context.log, this.getBatchName())
		try {
			await logging.start()
			if (this._myTimer.IsPastDue){
				await logging.warning('Timer function is running late!')
			}
			await this._db.connect()
			const events = await this._getEvents()
			if (events.length !== 0) {
				await this._saveEvents(events)
				await logging.info('save ' + events.length + ' data')
			}
		} catch (err) {
			let desctiption = (err as Error).stack
			if (typeof desctiption === 'undefined') {
				desctiption = (err as Error).message
			}
			await logging.error(desctiption)
			throw err
		}

		await logging.finish()
	}

	private async _saveEvents(events: Array<Map<string, any>>): Promise<void> {
		const eventTable = new EventTableAccessor(this._db.connection, this.getModelObject())
		const transaction = new Transaction(this._db.connection)
		await transaction.start()
		for (let event of events) {
			const eventMap = new Map(Object.entries(event))
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

			await transaction.save(saveData)
		}
	}

	private async _getEvents(): Promise<Array<Map<string, any>>> {
		const eventTable = new EventTableAccessor(this._db.connection, this.getModelObject())
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
	abstract getAbi(): any
	abstract getSaveData(event: Map<string, any>): any
	abstract getEventName(): string
}
