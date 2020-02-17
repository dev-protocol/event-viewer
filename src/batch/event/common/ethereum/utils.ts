// eslint-disable-next-line @typescript-eslint/no-var-requires
const Web3 = require('web3')

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function getApprovalBlockNumber() {
	const web3 = new Web3(new Web3.providers.HttpProvider(process.env.WEB3_URL!))
	// eslint-disable-next-line new-cap
	const currentBlockNumber = await new web3.eth.getBlockNumber()
	return currentBlockNumber - Number(process.env.APPROVAL!)
}
