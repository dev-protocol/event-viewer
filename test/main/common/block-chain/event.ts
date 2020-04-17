import { Web3 } from '../../../lib/web3-mock'
import { Event } from '../../../../common/block-chain/event'

describe('Event', () => {
	it('can get the corresponding event.', async () => {
		const web3 = new Web3({})
		const event = new Event(web3)
		await event.generateContract([], 'dummy-address')
		const events = await event.getEvent('dummy-event-name', 0, 1000000)
		expect(events.length).toBe(3)
		events.forEach((event) => {
			expect(event.get('id').includes('log-test')).toBe(true)
		})
	})
})
