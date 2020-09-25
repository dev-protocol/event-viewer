import {
	PropertyBalance,
	PropertyLockupSumValues,
	PropertyMeta,
} from '../../../../common/karma/data'

describe('PropertyBalance', () => {
	it('we can get information on the property.', async () => {
		const balance = new PropertyBalance('0x1234', 100)
		expect(balance.property).toBe('0x1234')
		expect(balance.balance).toBe(100)
	})
})

describe('PropertyLockupSumValues', () => {
	it('we can get information on the property.', async () => {
		const balance = new PropertyLockupSumValues('0x1234', 100)
		expect(balance.property).toBe('0x1234')
		expect(balance.sumValues).toBe(100)
	})
})

describe('PropertyMeta', () => {
	it('we can get information on the property.', async () => {
		const balance = new PropertyMeta('0x1234', 100)
		expect(balance.property).toBe('0x1234')
		expect(balance.toralSupply).toBe(100)
	})
})
