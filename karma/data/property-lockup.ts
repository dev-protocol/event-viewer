import { HttpRequest } from '@azure/functions'
import { postHasura } from '../utils'
import { PropertyLockupSumValues } from './data'

export class PropertyLockupDataStore {
	private readonly _req: HttpRequest
	private readonly _myPropertyLockupSumValues: PropertyLockupSumValues[]
	constructor(req: HttpRequest) {
		this._req = req
		this._myPropertyLockupSumValues = []
	}

	async prepare(addresses: string[]): Promise<void> {
		const query = `{
			property_lockup_sum_values(
				where: {
					property_address: {
						_in: ${JSON.stringify(addresses)}
					}
				}
				)
			{
				property_address
				sum_values
			}
		  }`
		const data = await postHasura(this._req, query)
		for (let record of data) {
			this._myPropertyLockupSumValues.push(
				new PropertyLockupSumValues(record.account_address, record.sum_values)
			)
		}
	}

	getSumValues(property: string): number {
		const tmp = this._myPropertyLockupSumValues.filter(
			(propertyLockupSumValues) => {
				return propertyLockupSumValues.property === property
			}
		)
		if (tmp.length >= 2) {
			throw new Error('illigal data')
		}

		return tmp.length === 0 ? 0 : tmp[0].sumValues
	}
}
