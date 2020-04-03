/* eslint-disable @typescript-eslint/camelcase */
import { EntityManager } from 'typeorm'

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
	it('can save data when you commit.', async () => {
		setDbSettings()
		const con = new DbConnection('test-batch-name')
		await con.connect()
		const manager = new EntityManager(con.connection)
		await manager.clear(LockupLockedup)
		const transaction = new Transaction(con.connection)
		await transaction.start()
		const lockupLockedup = new LockupLockedup()
		lockupLockedup.event_id = 'dummy-event-id'
		lockupLockedup.block_number = 30000
		lockupLockedup.log_index = 21
		lockupLockedup.transaction_index = 36
		lockupLockedup.from_address = '0x12345'
		lockupLockedup.property = '0x12345'
		lockupLockedup.token_value = 100
		lockupLockedup.raw_data = '{}'
		await transaction.save(lockupLockedup)
		await transaction.commit()
		await transaction.finish()

		const recordCount = await con.connection
			.getRepository(LockupLockedup)
			.count()
		await con.quit()
		expect(recordCount).toBe(1)
	})
	it('cannot save data when you rollback.', async () => {
		setDbSettings()
		const con = new DbConnection('test-batch-name')
		await con.connect()
		const manager = new EntityManager(con.connection)
		await manager.clear(LockupLockedup)
		const transaction = new Transaction(con.connection)
		await transaction.start()
		const lockupLockedup = new LockupLockedup()
		lockupLockedup.event_id = 'dummy-event-id'
		lockupLockedup.block_number = 30000
		lockupLockedup.log_index = 21
		lockupLockedup.transaction_index = 36
		lockupLockedup.from_address = '0x12345'
		lockupLockedup.property = '0x12345'
		lockupLockedup.token_value = 100
		lockupLockedup.raw_data = '{}'
		await transaction.save(lockupLockedup)
		await transaction.rollback()
		await transaction.finish()

		const recordCount = await con.connection
			.getRepository(LockupLockedup)
			.count()
		await con.quit()
		expect(recordCount).toBe(0)
	})
})
