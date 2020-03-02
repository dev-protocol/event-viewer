import { Context } from "@azure/functions"
import { EventSaverLogging } from './notifications'
import { EventViewerAccessor } from './db'
import { getApprovalBlockNumber, Event } from './block-chain'

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
		try {
			await logging.start()
			if (this._myTimer.IsPastDue){
				await logging.warning('Timer function is running late!')
			}
			await this._db.setup(this.getPartitionKey())
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
			const unnecessaryKeys = [...Array(10).keys()]
			unnecessaryKeys.some(function( key ) {
				const keyStr = String(key)
				if (keyStr in event['returnValues']) {
					delete event['returnValues'][keyStr]
				} else {
					return true
				}
			});
			event['eventId'] = event['id']
			delete event['id']
			await this._db.upsertItem(event)
		}
	}

	private async _getEvents(): Promise<Array<Map<string, any>>> {
		const recordCount = await this._db.getRecordCount()
		const contractJson = this.getAbi()
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

	abstract getContractAddress(): string
	abstract getBatchName(): string
	abstract getPartitionKey(): string
	abstract getAbi(): any
	//abstract getDirPath(): string
	abstract getEventName(): string
}
