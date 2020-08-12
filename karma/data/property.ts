import { postHasura } from '../utils'
import { PropertyMeta } from './data'
import { KarmaParams } from '../params'

export class PropertyDataStore {
	private readonly _params: KarmaParams
	private readonly _myProperty: PropertyMeta[]
	constructor(params: KarmaParams) {
		this._params = params
		this._myProperty = []
	}

	async prepare(addresses: string[]): Promise<void> {
		const query = `{
			property_meta(
				where: {
					property: {
						_in: ${JSON.stringify(addresses)}
					}
				}
				)
			{
				property
				total_supply
			}
		  }`
		const data = await postHasura(this._params.version, query)
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
}
