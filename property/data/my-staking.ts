import { postHasura } from '../utils'

export class MyStakingDataStore {
	private _stakingValue: number

	async prepare(version: string, accountAddress: string): Promise<void> {
		const query = `{
			account_lockup_sum_values(
				where: {
					account_address: {
						_eq: "${accountAddress}"
					}
				}
				)
			{
			  sum_values
			}
		  }`
		const data = await postHasura(version, query)
		this._stakingValue =
			data.account_lockup_sum_values.length === 0
				? 0
				: data.account_lockup_sum_values[0].sum_values
	}

	get stakingValue(): number {
		return this._stakingValue
	}
}
