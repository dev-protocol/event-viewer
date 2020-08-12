import { HttpRequest } from '@azure/functions'
import { postHasura } from '../utils'
import { PropertyBalance } from './data'

export class PropertyBalanceDataStore {
	private readonly _req: HttpRequest
	private readonly _myPropertyBalance: PropertyBalance[]
	constructor(req: HttpRequest) {
		this._req = req
		this._myPropertyBalance = []
	}

	async prepare(): Promise<void> {
		const query = `{
			property_balance(
				where: {
					account_address: {_eq: "${this._req.params.accountAddress}"},
					is_author: {_eq: false}
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

	getPropertyAddresses(): string[] {
		return this._myPropertyBalance.map((propertyMeta) => {
			return propertyMeta.property
		})
	}

	getBlance(property: string): number {
		const tmp = this._myPropertyBalance.filter((propertyBalance) => {
			return propertyBalance.property === property
		})
		if (tmp.length >= 2) {
			throw new Error('illigal data')
		}

		return tmp[0].balance
	}
}
