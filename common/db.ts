import { ObjectType, createConnection, BaseEntity, Connection, QueryRunner } from 'typeorm'


export class EventTableAccessor<Entity> {
	private _connection: Connection
	private _entityClass: ObjectType<Entity>

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

export class DbConnection {
	private _batchName: string
	constructor(batchName: string) {
		this._batchName = batchName
	}

	private _connection!: Connection

	get connection(): Connection {
		return this._connection
	}

	public async connect(): Promise<void> {
		const config = this._getConfig()
		this._connection = await createConnection(config)
		BaseEntity.useConnection(this._connection)
	}

	public async quit(): Promise<void> {
		await this._connection.close()
	}

	private _getConfig(): any {
		return {
			name: this._batchName,
			type: "postgres",
			synchronize: false,
			logging: false,
			entities: ["dist/entities/*.js"],
			host: process.env.DB_HOST!,
			port: process.env.DB_PORT!,
			username: process.env.DB_USERNAME!,
			password: process.env.DB_PASSWORD!,
			database: process.env.DB_DATABASE!
		}
	}
}

export class Transaction {
	private readonly _runner!: QueryRunner

	constructor(connection: Connection) {
		this._runner = connection.createQueryRunner()
	}

	public async start(): Promise<void> {
		await this._runner.connect()
		await this._runner.startTransaction()
	}

	public async save<Entity>(entity: Entity): Promise<void> {
		await this._runner.manager.save(entity)
	}

	public async commit(): Promise<void> {
		await this._runner.commitTransaction()
	}

	public async rollback(): Promise<void> {
		await this._runner.rollbackTransaction()
	}

	public async finish(): Promise<void> {
		await this._runner.release()
	}
}
