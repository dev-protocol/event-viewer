import { ObjectType } from 'typeorm'
import { getAbi } from 'src/batch/event/common/abi'
import { DbConnection, Transaction } from 'src/batch/event/common/db/common'
import { getMaxBlockNumber } from 'src/batch/event/common/db/utils'
import { getApprovalBlockNumber } from 'src/batch/event/common/ethereum/utils'
import { Event } from 'src/batch/event/common/ethereum/event'
import { DiscordNotification } from 'src/batch/event/common/notification/discord'

export abstract class EventSaver {
	private _db!: DbConnection

	public async execute(): Promise<void> {
		const notification = new DiscordNotification()
		try {
			await this._setup()
			const events = await this._getEvents()
			await this._saveEvents(events)

			await notification.sendInfo(
				'save event batch',
				this.getBatchName(),
				'message',
				'completed successfully'
			)
		} catch (err) {
			console.error(err)
			let desctiption = (err as Error).stack
			if (typeof desctiption === 'undefined') {
				desctiption = (err as Error).message
			}

			await notification.sendError(
				'save event batch',
				this.getBatchName(),
				'message',
				desctiption
			)
			throw err
		} finally {
			await this._db.quit()
		}
	}

	private async _setup(): Promise<void> {
		this._db = new DbConnection()
		await this._db.connect()
	}

	private async _saveEvents(events: any[]): Promise<void> {
		const transaction = new Transaction(this._db.connection)
		await transaction.start()
		for (let event of events) {
			const saveData = this.getSaveData(event)
			// eslint-disable-next-line no-await-in-loop
			await transaction.save(saveData)
		}

		await transaction.finish()
	}

	private async _getEvents(): Promise<any[]> {
		const maxBlockNumber = await getMaxBlockNumber(this.getModelObject())
		const contractJson = getAbi(this.getDirPath())
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
	abstract getEventName(): string
	abstract getDirPath(): string
	abstract getBatchName(): string
	// eslint-disable-next-line @typescript-eslint/no-untyped-public-signature
	abstract getSaveData(event: any): any
}
