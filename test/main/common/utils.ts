import { isNotEmpty } from '../../../common/utils'

describe('isNotEmpty', () => {
	it('null is recognized as an empty string.', async () => {
		const result = isNotEmpty(null)
		expect(result).toBe(false)
	})
	it('undefined is recognized as an empty string.', async () => {
		const result = isNotEmpty(undefined)
		expect(result).toBe(false)
	})
	it('0-byte character string is recognized as an empty string.', async () => {
		const result = isNotEmpty('')
		expect(result).toBe(false)
	})
	it('[test] is not recognized as an empty string.', async () => {
		const result = isNotEmpty('test')
		expect(result).toBe(true)
	})
})
