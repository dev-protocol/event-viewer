import { Connection } from 'typeorm'
import { ContractAddress } from '../../entities/contract_address'

export class ContractAddressAccessor {
	private readonly _connection: Connection

	constructor(connection: Connection) {
		this._connection = connection
	}

	public async getContractAddress(batchName: string): Promise<string> {
		const record = await this._connection
			.getRepository(ContractAddress)
			.createQueryBuilder('contract_address')
			.where('contract_address.batch_name = :name', { name: batchName })
			.getRawOne()
		return record.contract_address_contract_address
	}
}
