import { Connection } from 'typeorm'
import { ContractInfo } from '../../entities/contract-info'
import { GroupContractInfo } from '../../entities/group-contract-info'
import { LegacyGroupContractInfo } from '../../entities/legacy-group-contract-info'

export async function getContractInfo(
	connection: Connection,
	batchName: string
): Promise<object> {
	const record = await connection
		.getRepository(ContractInfo)
		.createQueryBuilder('contract_info')
		.where('contract_info.name = :name', { name: batchName })
		.getRawOne()
	return record
}

export async function getGroupContractInfo(
	connection: Connection,
	contractName: string
): Promise<object> {
	const record = await connection
		.getRepository(GroupContractInfo)
		.createQueryBuilder('group_contract_info')
		.where('group_contract_info.name = :name', { name: contractName })
		.getRawOne()
	return record
}

export async function getLegacyGroupContractInfo(
	connection: Connection,
	contractName: string,
	contractAddress: string
): Promise<object> {
	const record = await connection
		.getRepository(LegacyGroupContractInfo)
		.createQueryBuilder('legacy_group_contract_info')
		.where(
			'legacy_group_contract_info.name = :name AND legacy_group_contract_info.address = :address',
			{ name: contractName, address: contractAddress }
		)
		.getRawOne()
	return record
}
