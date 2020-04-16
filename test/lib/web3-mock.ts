export class Web3 {
	eth: any
	constructor(_: any) {
		this.eth = {
			// eslint-disable-next-line @typescript-eslint/promise-function-async
			getBlockNumber: function() {
				return new Promise(resolve => {
					resolve(25000)
				})
			},
			Contract: class Contract {
				_abi: any
				_address: string
				constructor(abi: any, address: string) {
					this._abi = abi
					this._address = address
				}

				public async getPastEvents(
					_: string,
					__: object
				): Promise<Array<Map<string, any>>> {
					const tmpMap1 = new Map<string, any>()
					tmpMap1.set('id', 'log-test1')
					tmpMap1.set('blockNumber', 24590)
					tmpMap1.set('logIndex', 23)
					tmpMap1.set('transactionIndex', 20)

					const tmpMap2 = new Map<string, any>()
					tmpMap2.set('id', 'log-test2')
					tmpMap2.set('blockNumber', 24592)
					tmpMap2.set('logIndex', 24)
					tmpMap2.set('transactionIndex', 25)

					const tmpMap3 = new Map<string, any>()
					tmpMap3.set('id', 'log-test3')
					tmpMap3.set('blockNumber', 24599)
					tmpMap3.set('logIndex', 21)
					tmpMap3.set('transactionIndex', 19)

					return new Promise(resolve => {
						resolve([tmpMap1, tmpMap2, tmpMap3])
					})
				}
			}
		}
	}
}
