import {
	getConnectionOptions,
	createConnection,
	BaseEntity,
	Connection,
	QueryRunner
} from 'typeorm'

export class DbConnection {
	private _connection!: Connection

	get connection(): Connection {
		return this._connection
	}

	public async connect(): Promise<void> {
		const connectionOptions = await getConnectionOptions()
		this._connection = await createConnection(connectionOptions)
		BaseEntity.useConnection(this._connection)
	}

	public async quit(): Promise<void> {
		await this._connection.close()
	}
}

export class Transaction {
	private readonly _runner!: QueryRunner

	constructor(connection: Connection) {
		this._runner = connection.createQueryRunner()
	}

	public async start(): Promise<void> {
		console.log(1)
		try {
			console.log(2)
			await this._runner.connect()
			console.log(3)
		} catch (err) {
			console.log(4)
			console.log(err)
		} finally {
			console.log(5)
		}

		console.log(6)
		await this._runner.startTransaction()
		console.log(7)
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
