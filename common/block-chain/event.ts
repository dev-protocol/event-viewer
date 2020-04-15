export class Event {
	private readonly _web3: any
	private _contract: any
	// eslint-disable-next-line @typescript-eslint/no-untyped-public-signature
	constructor(web3: any) {
		this._web3 = web3
	}

	// eslint-disable-next-line @typescript-eslint/no-untyped-public-signature
	public async generateContract(
		abi: any,
		contractAddress: string
	): Promise<void> {
		this._contract = await new this._web3.eth.Contract(abi, contractAddress)
	}

	public async getEvent(
		eventName: string,
		firstBlock: number,
		lastBlock: number | string
	): Promise<Array<Map<string, any>>> {
		const events = await this._contract.getPastEvents(eventName, {
			fromBlock: firstBlock,
			toBlock: lastBlock
		})
		return events
	}
}
