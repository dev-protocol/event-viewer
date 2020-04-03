/* eslint-disable @typescript-eslint/camelcase */
import { EntityManager, Connection } from 'typeorm'

import { DbConnection, Transaction } from '../../../../common/db/common'
import { LockupLockedup } from '../../../../entities/lockup-lockedup'
import { setDbSettings } from './../../../lib/environment'

describe('DbConnection', () => {
	it('can connect to db.', async () => {
		setDbSettings()
		const con = new DbConnection('test-batch-name')
		await con.connect()
		expect(con.connection.isConnected).toBe(true)
		await con.quit()
	})
})

describe('Transaction', () => {
	it('commitするとデータが保存できる.', async () => {
		setDbSettings()
		const con = new DbConnection('test-batch-name')
		await con.connect()
		await deleteAllData(con.connection)
		const transaction = new Transaction(con.connection)
		await transaction.start()
		const lockupLockedup = new LockupLockedup()
		lockupLockedup.event_id = 'dummy-event-id'
		lockupLockedup.block_number = 30000
		lockupLockedup.log_index = 21
		lockupLockedup.transaction_index = 36
		// LockupLockedup.from_address = '0x12345'
		// lockupLockedup.property = '0x12345'
		lockupLockedup.token_value = 100
		lockupLockedup.raw_data = '{}'

		await con.quit()
	})
	it('rollbackするとデータが保存されない.', async () => {
		setDbSettings()
		const con = new DbConnection('test-batch-name')
		await con.connect()
		await deleteAllData(con.connection)
		const transaction = new Transaction(con.connection)
		await transaction.start()

		await con.quit()
	})
})

async function deleteAllData(con: Connection): Promise<void> {
	const manager = new EntityManager(con)
	await manager.clear(LockupLockedup)
}

// Export class Transaction {
// 	private readonly _runner!: QueryRunner

// 	constructor(connection: Connection) {
// 		this._runner = connection.createQueryRunner()
// 	}

// 	public async start(): Promise<void> {
// 		await this._runner.connect()
// 		await this._runner.startTransaction()
// 	}

// 	public async save<Entity>(entity: Entity): Promise<void> {
// 		await this._runner.manager.save(entity)
// 	}

// 	public async commit(): Promise<void> {
// 		await this._runner.commitTransaction()
// 	}

// 	public async rollback(): Promise<void> {
// 		await this._runner.rollbackTransaction()
// 	}

// 	public async finish(): Promise<void> {
// 		await this._runner.release()
// 	}
// }
