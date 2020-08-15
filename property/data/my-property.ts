import { postHasura } from '../utils'
import { PropertyMeta } from './data'

export class MyPropertyDataStore {
	private readonly _myProperty: PropertyMeta[]
	constructor() {
		this._myProperty = []
	}

	async prepare(version: string, accountAddress: string): Promise<void> {
		const query = `{
			property_meta(
				where: {
					author: {
						_eq: "${accountAddress}"
					}
				}
				)
			{
			  property
			  total_supply
			}
		  }`
		const data = await postHasura(version, query)
		for (let record of data.property_meta) {
			this._myProperty.push(
				new PropertyMeta(record.property, record.total_supply)
			)
		}
	}

	getTotalSupply(property: string): number {
		const tmp = this._myProperty.filter((propertyMeta) => {
			return propertyMeta.property === property
		})
		if (tmp.length === 0) {
			throw new Error('illigal property address')
		}

		return tmp[0].toralSupply
	}

	getPropertyAddresses(): string[] {
		const tmp = this._myProperty.map((propertyMeta) => {
			return propertyMeta.property
		})
		return tmp
	}
}
