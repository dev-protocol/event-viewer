import { CosmosClient } from '@azure/cosmos'

module DB_CONST{
	export const NAME = "event-viewer"
}

export class EventViewerAccessor {
	private _client!: CosmosClient
	private _containerName: string

	constructor(containerName: string) {
		this._containerName = containerName
	}

	public async setup(partitionKeyName: string): Promise<void> {
		await this._connect()
		await this._createDataBase()
		await this._createContainer(partitionKeyName)
	}

	public async getRecordCount(): Promise<Number> {
		const querySpec = {
			query: `SELECT VALUE COUNT(1) FROM ${this._containerName} c`,
		}
		const { resources: results } = await this._client
			.database(DB_CONST.NAME)
			.container(this._containerName)
			.items.query(querySpec)
			.fetchNext()
		return results[0]
	}

	public async upsertItem(item: object): Promise<void> {
		await this._client.database(DB_CONST.NAME).container(this._containerName).items.upsert(item)
	}

	private async _connect(): Promise<void> {
		const endpoint = process.env.DB_END_POINT!
		const key = process.env.DB_KEY!
		this._client = new CosmosClient({endpoint, key})
	}

	private async _createDataBase(): Promise<void> {
		await this._client.databases.createIfNotExists({
			id: DB_CONST.NAME
		  })
	}

	private async _createContainer(partitionKeyName: string): Promise<void> {
		const partitionKeyInfo = { paths: [partitionKeyName] }
		await this._client.database(DB_CONST.NAME)
		.containers.createIfNotExists(
		  { id: this._containerName, partitionKey: partitionKeyInfo, uniqueKeyPolicy: {uniqueKeys: [{ paths: ['/eventId']}]}},
		  { offerThroughput: 400 }
		)
	}
}
