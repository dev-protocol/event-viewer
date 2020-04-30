import { EntityManager, Connection } from 'typeorm'
import { Transaction } from '../../common/db/common'
import { LockupLockedup } from '../../entities/lockup-lockedup'
import { ContractInfo } from '../../entities/contract-info'
import { GroupContractInfo } from '../../entities/group-contract-info'
import { LegacyGroupContractInfo } from '../../entities/legacy-group-contract-info'

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

export async function saveContractInfoTestdata(con: Connection): Promise<void> {
	const manager = new EntityManager(con)
	await manager.clear(ContractInfo)
	const transaction = new Transaction(con)
	await transaction.start()
	const contractInfo = new ContractInfo()

	contractInfo.name = 'dummy-name-1'
	contractInfo.address = '0x152437ababab'
	contractInfo.abi =
		'[{"inputs": [{"internalType": "address","name": "_config","type": "string"}]}]'
	await transaction.save(contractInfo)

	contractInfo.name = 'dummy-name-2'
	contractInfo.address = '0x152437cdcdcd'
	contractInfo.abi =
		'[{"inputs": [{"internalType": "address","name": "_config","type": "address"}]}]'
	await transaction.save(contractInfo)

	contractInfo.name = 'dummy-name-3'
	contractInfo.address = '0x152437efefef'
	contractInfo.abi =
		'[{"inputs": [{"internalType": "address","name": "_config","type": "uint"}]}]'
	await transaction.save(contractInfo)

	await transaction.commit()
	await transaction.finish()
}

export async function clearContractInfoTestdata(
	con: Connection
): Promise<void> {
	const manager = new EntityManager(con)
	await manager.clear(ContractInfo)
}

export async function saveGroupContractInfoTestdata(
	con: Connection
): Promise<void> {
	await clearGroupContractInfoTestdata(con)
	const transaction = new Transaction(con)
	await transaction.start()
	const groupContractInfo = new GroupContractInfo()

	groupContractInfo.name = 'Metrics'
	groupContractInfo.abi =
		'[{"inputs": [{"internalType": "address","name": "_config","type": "string"}]}]'
	await transaction.save(groupContractInfo)

	groupContractInfo.name = 'dummy-name-2'
	groupContractInfo.abi =
		'[{"inputs": [{"internalType": "address","name": "_config","type": "address"}]}]'
	await transaction.save(groupContractInfo)

	groupContractInfo.name = 'dummy-name-3'
	groupContractInfo.abi =
		'[{"inputs": [{"internalType": "address","name": "_config","type": "uint"}]}]'
	await transaction.save(groupContractInfo)

	await transaction.commit()
	await transaction.finish()
}

export async function clearGroupContractInfoTestdata(
	con: Connection
): Promise<void> {
	const manager = new EntityManager(con)
	await manager.clear(GroupContractInfo)
}

export async function saveLegacyGroupContractInfoTestdata(
	con: Connection
): Promise<void> {
	const manager = new EntityManager(con)
	await manager.clear(LegacyGroupContractInfo)
	const transaction = new Transaction(con)
	await transaction.start()
	const legacyGroupContractInfo = new LegacyGroupContractInfo()

	legacyGroupContractInfo.name = 'dummy-name-1'
	legacyGroupContractInfo.address = '0x152437ababab'
	legacyGroupContractInfo.abi =
		'[{"inputs": [{"internalType": "address","name": "_config","type": "string"}]}]'
	await transaction.save(legacyGroupContractInfo)

	legacyGroupContractInfo.name = 'dummy-name-2'
	legacyGroupContractInfo.address = '0x152437cdcdcd'
	legacyGroupContractInfo.abi =
		'[{"inputs": [{"internalType": "address","name": "_config","type": "address"}]}]'
	await transaction.save(legacyGroupContractInfo)

	legacyGroupContractInfo.name = 'dummy-name-3'
	legacyGroupContractInfo.address = '0x152437efefef'
	legacyGroupContractInfo.abi =
		'[{"inputs": [{"internalType": "address","name": "_config","type": "uint"}]}]'
	await transaction.save(legacyGroupContractInfo)

	await transaction.commit()
	await transaction.finish()
}
