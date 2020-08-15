import { ApiParams } from '../params'
import { postHasura } from '../utils'
import { PropertyBalance } from './data'

export class MyPropertyBalanceDataStore {
	private readonly _params: ApiParams
	private readonly _myPropertyBalance: PropertyBalance[]
	constructor(params: ApiParams) {
		this._params = params
		this._myPropertyBalance = []
	}

	async prepare(addresses: string[]): Promise<void> {
		const query = `{
			property_balance(
				where: {
					property_address: {
						_in: ${JSON.stringify(addresses)}
					},
					account_address: {_eq: "${this._params.address}"},
					is_author: {_eq: true}
				}
				)
			{
				property_address
				balance
			}
		  }`
		const data = await postHasura(this._params.version, query)
		for (let record of data.property_balance) {
			this._myPropertyBalance.push(
				new PropertyBalance(record.property_address, record.balance)
			)
		}
	}

	getBlance(property: string, totalSupply: number): number {
		const tmp = this._myPropertyBalance.filter((propertyBalance) => {
			return propertyBalance.property === property
		})
		if (tmp.length >= 2) {
			throw new Error('illigal data')
		}

		return tmp.length === 0 ? totalSupply : tmp[0].balance
	}
}
