import { postHasura } from '../utils'
import { KarmaParams } from '../params'

export class MyStakingDataStore {
	private readonly _params: KarmaParams
	private _stakingValue: number
	constructor(params: KarmaParams) {
		this._params = params
	}

	async prepare(): Promise<void> {
		const query = `{
			account_lockup_sum_values(
				where: {
					account_address: {
						_eq: "${this._params.address}"
					}
				}
				)
			{
			  sum_values
			}
		  }`
		const data = await postHasura(this._params.version, query)
		this._stakingValue =
			data.account_lockup_sum_values.length === 0
				? 0
				: data.account_lockup_sum_values[0].sum_values
	}

	get stakingValue(): number {
		return this._stakingValue
	}
}
