import { Connection } from 'typeorm'
import { ContractInfo } from '../../entities/contract-info'
import { GroupContractInfo } from '../../entities/group-contract-info'
import { LegacyGroupContractInfo } from '../../entities/legacy-group-contract-info'

export class ContractInfoAccessor {
	private readonly _connection: Connection

	constructor(connection: Connection) {
		this._connection = connection
	}

	public async getContractInfo(batchName: string): Promise<object> {
		const record = await this._connection
			.getRepository(ContractInfo)
			.createQueryBuilder('contract_info')
			.where('contract_info.name = :name', { name: batchName })
			.getRawOne()
		return record
	}
}

export class GroupContractInfoAccessor {
	private readonly _connection: Connection

	constructor(connection: Connection) {
		this._connection = connection
	}

	public async getContractInfo(contractName: string): Promise<object> {
		const record = await this._connection
			.getRepository(GroupContractInfo)
			.createQueryBuilder('group_contract_info')
			.where('group_contract_info.name = :name', { name: contractName })
			.getRawOne()
		return record
	}
}

export class LegacyGroupContractInfoAccessor {
	private readonly _connection: Connection

	constructor(connection: Connection) {
		this._connection = connection
	}

	public async getContractInfo(
		contractName: string,
		contractAddress: string
	): Promise<object> {
		const record = await this._connection
			.getRepository(LegacyGroupContractInfo)
			.createQueryBuilder('legacy_group_contract_info')
			.where(
				'legacy_group_contract_info.name = :name AND legacy_group_contract_info.address = :address',
				{ name: contractName, address: contractAddress }
			)
			.getRawOne()
		return record
	}
}
