import { getRepository, ObjectType, createConnection, BaseEntity, Connection, QueryRunner } from 'typeorm'



export class EventTableAccessor<Entity> {
	private _connection: Connection
	private _entityClass: ObjectType<Entity>

	constructor(connection: Connection, entityClass: ObjectType<Entity>) {
		this._connection = connection
		this._entityClass = entityClass
	}

	public async getMaxBlockNumber<Entity>(): Promise<number> {
		let { max } = await getRepository(this._entityClass)
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
	private _connection!: Connection

	get connection(): Connection {
		return this._connection
	}

	public async connect(): Promise<void> {
		const config = this._getConfig()
		console.log(config)
		this._connection = await createConnection(config)
		BaseEntity.useConnection(this._connection)
	}

	public async quit(): Promise<void> {
		try {
			await this._connection.close()
		} catch (err) {
			console.error(err)
		}
	}

	private _getConfig(): any {
		return {
			type: "postgres",
			synchronize: false,
			logging: false,
			entities: ["/entity/*.ts"],
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

	public async finish(): Promise<void> {
		try {
			await this._runner.commitTransaction()
		} catch (err) {
			console.error(err)
			await this._runner.rollbackTransaction()
			throw err
		} finally {
			await this._runner.release()
		}
	}
}
