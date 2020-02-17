import * as fs from 'fs'
import * as path from 'path'
import { createConnection, BaseEntity, Connection, QueryRunner } from 'typeorm'

export class DbConnection {
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
		try {
			await this._connection.close()
		} catch (err) {
			console.error(err)
		}
	}

	private _getConfig(): any {
		const abiFilePath = path.join(__dirname, 'config.json')
		const baseSettings = JSON.parse(fs.readFileSync(abiFilePath, 'utf8'))
		baseSettings.host = process.env.DB_HOST!
		baseSettings.port = process.env.DB_PORT!
		baseSettings.username = process.env.DB_USERNAME!
		baseSettings.password = process.env.DB_PASSWORD!
		baseSettings.database = process.env.DB_DATABASE!
		return baseSettings
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
