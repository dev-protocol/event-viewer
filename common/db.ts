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

	public async connect(): Promise<void> {
		const endpoint = process.env.DB_END_POINT!
		const key = process.env.DB_KEY!
		this._client = new CosmosClient({endpoint, key})
	}

	public async createDataBase(): Promise<void> {
		await this._client.databases.createIfNotExists({
			id: DB_CONST.NAME
		  })
	}

	public async createContainer(partitionKeyName: string): Promise<void> {
		const partitionKeyInfo = { paths: [partitionKeyName] }
		await this._client.database(DB_CONST.NAME)
		.containers.createIfNotExists(
		  { id: this._containerName, partitionKey: partitionKeyInfo, uniqueKeyPolicy: {uniqueKeys: [{ paths: ['id']}]}},
		  { offerThroughput: 400 }
		)
	}

	public async getRecordCount(): Promise<Number> {
		const querySpec = {
			query: 'SELECT COUNT(*) as record_count FROM @containerName',
			parameters: [
				{
					name: '@containerName',
					value: this._containerName
			  	}
			]
		}

		const { resources: results } = await this._client
			.database(DB_CONST.NAME)
			.container(this._containerName)
			.items.query(querySpec)
			.fetchNext()

		return results[0].record_count
	}
}
