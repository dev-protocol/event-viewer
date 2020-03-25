import { Connection } from 'typeorm'
import { ContractInfo } from '../../entities/contract-info'

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
