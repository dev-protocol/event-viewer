import { ObjectType, Connection } from 'typeorm'

export class EventTableAccessor<Entity> {
	private readonly _connection: Connection
	private readonly _entityClass: ObjectType<Entity>

	constructor(connection: Connection, entityClass: ObjectType<Entity>) {
		this._connection = connection
		this._entityClass = entityClass
	}

	public async getMaxBlockNumber<Entity>(): Promise<number> {
		let { max } = await this._connection
			.getRepository(this._entityClass)
			.createQueryBuilder()
			.select('MAX(block_number)', 'max')
			.getRawOne()
		if (max === null) {
			max = 0
		}

		return Number(max)
	}

	public async hasData(eventId: string): Promise<boolean> {
		const firstUser = await this._connection
			.getRepository(this._entityClass)
			.createQueryBuilder('tmp')
			.where('tmp.event_id = :id', { id: eventId })
			.getOne()
		return typeof firstUser !== 'undefined'
	}
}
