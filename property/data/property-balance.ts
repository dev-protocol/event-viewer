import { postHasura } from '../utils'
import { PropertyBalance } from './data'

export class PropertyBalanceDataStore {
	private readonly _myPropertyBalance: PropertyBalance[]
	constructor() {
		this._myPropertyBalance = []
	}

	async prepare(version: string, accountAddress: string): Promise<void> {
		const query = `{
			property_balance(
				where: {
					account_address: {_eq: "${accountAddress}"},
					is_author: {_eq: false}
				}
				)
			{
				property_address
				balance
			}
		  }`
		const data = await postHasura(version, query)
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
