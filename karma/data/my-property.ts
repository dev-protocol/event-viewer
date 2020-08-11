import { HttpRequest } from '@azure/functions'
import { postHasura } from '../utils'
import { PropertyMeta } from './data'

export class MyPropertyDataStore {
	private readonly _req: HttpRequest
	private readonly _myProperty: PropertyMeta[]
	constructor(req: HttpRequest) {
		this._req = req
		this._myProperty = []
	}

	async prepare(): Promise<void> {
		const query = `{
			property_meta(
				where: {
					author: {
						_eq: "${this._req.params.accountAddress}"
					}
				}
				)
			{
				property
				total_supply
			}
		  }`
		const data = await postHasura(this._req, query)
		console.log(data)
		for (let record of data) {
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
		// Console.log(this._myProperty)
		const tmp = this._myProperty.map((propertyMeta) => {
			return propertyMeta.property
		})
		// Console.log(tmp)
		return tmp
	}
}
