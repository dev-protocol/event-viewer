import { HttpRequest } from '@azure/functions'
import { postHasura } from '../utils'

export class MyStakingDataStore {
	private readonly _req: HttpRequest
	private _stakingValue: number
	constructor(req: HttpRequest) {
		this._req = req
	}

	async prepare(): Promise<void> {
		const query = `{
			account_lockup_sum_values(
				where: {
					account_address: {
						_eq: "${this._req.params.accountAddress}"
					}
				}
				)
			{
			  sum_values
			}
		  }`
		const data = await postHasura(this._req, query)
		this._stakingValue = data.length === 0 ? 0 : data[0].sum_values
	}

	get stakingValue(): number {
		return this._stakingValue
	}
}
