import { Web3 } from '../../../lib/web3-mock'
import { getApprovalBlockNumber } from '../../../../common/block-chain/utils'

describe('getApprovalBlockNumber', () => {
	it('Get the block number to be approved.', async () => {
		process.env.APPROVAL = '50'
		const web3 = new Web3({})
		const result = await getApprovalBlockNumber(web3)
		expect(result).toBe(24950)
	})
})
