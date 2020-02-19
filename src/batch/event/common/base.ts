/* eslint-disable @typescript-eslint/camelcase */
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
				this.getTableName(),
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
				this.getTableName(),
				'message',
				desctiption
			)
			throw err
		} finally {
			await this._db.quit()
		}

		console.log('finish')
	}

	private async _setup(): Promise<void> {
		this._db = new DbConnection()
		await this._db.connect()
	}

	private async _saveEvents(events: Array<Map<string, any>>): Promise<void> {
		const transaction = new Transaction(this._db.connection)
		await transaction.start()
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

			// eslint-disable-next-line no-await-in-loop
			await transaction.save(saveData)
		}

		await transaction.finish()
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
	abstract getTableName(): string
	// eslint-disable-next-line @typescript-eslint/no-untyped-public-signature
	abstract getSaveData(event: Map<string, any>): any
}
