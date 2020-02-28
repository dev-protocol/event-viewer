import { Context } from "@azure/functions"


import { getAbi } from 'src/batch/event/common/abi'
import { EventSaverLogging } from 'common/notifications'
import { EventViewerAccessor } from 'common/db'
import { getApprovalBlockNumber, Event } from 'common/block-chain'

export abstract class EventSaver {
	private _db: EventViewerAccessor
	private _context: Context
	private _myTimer: any

	constructor(context: Context, myTimer: any, containerName: string) {
		this._context = context
		this._myTimer = myTimer
		this._db = new EventViewerAccessor(containerName)
	}

	public async execute(): Promise<void> {
		const logging = new EventSaverLogging(this._context.log, this.getBatchName())

		await logging.start()
		if (this._myTimer.IsPastDue){
			await logging.warning('Timer function is running late!')
		}
		try {
			await await this._db.connect()
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
		for (let event of events) {
			const eventMap = new Map(Object.entries(event))

			// eslint-disable-next-line no-await-in-loop
			const hasData = await this._hasData(eventMap.get('id'))
			if (hasData) {
				throw Error('Data already exists.')
			}

			const saveData = this.getSaveData(eventMap)
			saveData.event_id = eventMap.get('id')
			saveData.block_number = eventMap.get('blockNumber')
			saveData.log_index = eventMap.get('logIndex')
			saveData.transaction_index = eventMap.get('transactionIndex')
			saveData.raw_data = JSON.stringify(event)
		}
	}

	private async _hasData(eventId: string): Promise<boolean> {
		const firstUser = await this._db.connection
			.getRepository(this.getModelObject())
			.createQueryBuilder('tmp')
			.where('tmp.event_id = :id', { id: eventId })
			.getOne()
		return typeof firstUser !== 'undefined'
	}

	private async _getEvents(): Promise<Array<Map<string, any>>> {
		const recordCount = await this._db.getRecordCount()
		const contractJson = getAbi(this.getDirPath())
		const approvalBlockNumber = await getApprovalBlockNumber()
		let startBlockNumber = 0
		if (recordCount !== 0) {
			startBlockNumber = approvalBlockNumber - Number(process.env.GO_BACK_BLOCK_NUMBER!)
		}
		const event = new Event()
		await event.generateContract(contractJson, this.getContractAddress())
		const events = await event.getEvent(
			this.getEventName(),
			startBlockNumber,
			approvalBlockNumber
		)
		return events
	}

	abstract getModelObject<Entity>(): ObjectType<Entity>
	abstract getContractAddress(): string
	abstract getBatchName(): string
	abstract getDirPath(): string
	abstract getEventName(): string
	// eslint-disable-next-line @typescript-eslint/no-untyped-public-signature
	abstract getSaveData(event: Map<string, any>): any
}
