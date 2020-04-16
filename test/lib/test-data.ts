import { EntityManager, Connection } from 'typeorm'
import { Transaction } from '../../common/db/common'
import { LockupLockedup } from '../../entities/lockup-lockedup'

export async function saveLockupLockupedTestdata(
	con: Connection,
	executeCommit: boolean
): Promise<void> {
	await clearLockupLockupedTestdata(con)
	const transaction = new Transaction(con)
	await transaction.start()
	const lockupLockedup = new LockupLockedup()

	lockupLockedup.event_id = 'dummy-event-id1'
	lockupLockedup.block_number = 30000
	lockupLockedup.log_index = 21
	lockupLockedup.transaction_index = 36
	lockupLockedup.from_address = '0x12345'
	lockupLockedup.property = '0x12345'
	lockupLockedup.token_value = 100
	lockupLockedup.raw_data = '{}'
	await transaction.save(lockupLockedup)

	lockupLockedup.event_id = 'dummy-event-id2'
	lockupLockedup.block_number = 31000
	lockupLockedup.log_index = 23
	lockupLockedup.transaction_index = 30
	lockupLockedup.from_address = '0x82736'
	lockupLockedup.property = '0xabe34'
	lockupLockedup.token_value = 10
	lockupLockedup.raw_data = '{}'
	await transaction.save(lockupLockedup)

	lockupLockedup.event_id = 'dummy-event-id3'
	lockupLockedup.block_number = 32000
	lockupLockedup.log_index = 19
	lockupLockedup.transaction_index = 12
	lockupLockedup.from_address = '0xab123'
	lockupLockedup.property = '0xcd435'
	lockupLockedup.token_value = 5
	lockupLockedup.raw_data = '{}'
	await transaction.save(lockupLockedup)
	if (executeCommit) {
		await transaction.commit()
	} else {
		await transaction.rollback()
	}

	await transaction.finish()
}

export async function clearLockupLockupedTestdata(
	con: Connection
): Promise<void> {
	const manager = new EntityManager(con)
	await manager.clear(LockupLockedup)
}
