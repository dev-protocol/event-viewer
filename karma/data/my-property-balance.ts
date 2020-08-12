import { HttpRequest } from '@azure/functions'
import { postHasura } from '../utils'
import { PropertyBalance } from './data'

export class MyPropertyBalanceDataStore {
	private readonly _req: HttpRequest
	private readonly _myPropertyBalance: PropertyBalance[]
	constructor(req: HttpRequest) {
		this._req = req
		this._myPropertyBalance = []
	}

	async prepare(addresses: string[]): Promise<void> {
		const query = `{
			property_balance(
				where: {
					property_address: {
						_in: ${JSON.stringify(addresses)}
					},
					account_address: {_eq: "${this._req.params.accountAddress}"},
					is_author: {_eq: true}
				}
				)
			{
				property_address
				balance
			}
		  }`
		const data = await postHasura(this._req, query)
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
