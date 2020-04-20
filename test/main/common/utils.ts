import {
	isNotEmpty,
	getTargetRecordsSeparatedByBlockNumber,
} from '../../../common/utils'

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

describe('getTargetRecordsSeparatedByBlockNumber', () => {
	describe('the block numbers are different.', () => {
		const param = [
			{ block_number: 1, value: 'test1' },
			{ block_number: 2, value: 'test2' },
			{ block_number: 3, value: 'test3' },
			{ block_number: 4, value: 'test4' },
			{ block_number: 5, value: 'test5' },
		]
		it('If the number of records is more than the parameter number, all records will be returned.', async () => {
			const results = getTargetRecordsSeparatedByBlockNumber(param, 100)

			expect(results.length).toBe(5)
			expect(results[0].block_number).toBe(1)
			expect(results[0].value).toBe('test1')
			expect(results[1].block_number).toBe(2)
			expect(results[1].value).toBe('test2')
			expect(results[2].block_number).toBe(3)
			expect(results[2].value).toBe('test3')
			expect(results[3].block_number).toBe(4)
			expect(results[3].value).toBe('test4')
			expect(results[4].block_number).toBe(5)
			expect(results[4].value).toBe('test5')
		})
		it('Retrieve the number of records as specified in the parameter.', async () => {
			const results = getTargetRecordsSeparatedByBlockNumber(param, 3)

			expect(results.length).toBe(3)
			expect(results[0].block_number).toBe(1)
			expect(results[0].value).toBe('test1')
			expect(results[1].block_number).toBe(2)
			expect(results[1].value).toBe('test2')
			expect(results[2].block_number).toBe(3)
			expect(results[2].value).toBe('test3')
		})
		it('If 0 is specified, records cannot be retrieved.', async () => {
			const results = getTargetRecordsSeparatedByBlockNumber(param, 0)

			expect(results.length).toBe(0)
		})
	})
	describe('the block numbers are the same.', () => {
		const param = [
			{ block_number: 1, value: 'test1' },
			{ block_number: 2, value: 'test2' },
			{ block_number: 3, value: 'test3' },
			{ block_number: 3, value: 'test4' },
			{ block_number: 3, value: 'test5' },
			{ block_number: 4, value: 'test6' },
		]
		it('Retrieve the number of records as specified in the parameter.', async () => {
			const results = getTargetRecordsSeparatedByBlockNumber(param, 2)

			expect(results.length).toBe(2)
			expect(results[0].block_number).toBe(1)
			expect(results[0].value).toBe('test1')
			expect(results[1].block_number).toBe(2)
			expect(results[1].value).toBe('test2')
		})
		it('If a number is duplicated, data is retrieved until the number is advanced. pert1.', async () => {
			const results = getTargetRecordsSeparatedByBlockNumber(param, 3)

			expect(results.length).toBe(5)
			expect(results[0].block_number).toBe(1)
			expect(results[0].value).toBe('test1')
			expect(results[1].block_number).toBe(2)
			expect(results[1].value).toBe('test2')
			expect(results[2].block_number).toBe(3)
			expect(results[2].value).toBe('test3')
			expect(results[3].block_number).toBe(3)
			expect(results[3].value).toBe('test4')
			expect(results[3].block_number).toBe(3)
			expect(results[3].value).toBe('test5')
		})

		it('If a number is duplicated, data is retrieved until the number is advanced. pert2.', async () => {
			const results = getTargetRecordsSeparatedByBlockNumber(param, 4)

			expect(results.length).toBe(4)
			expect(results[0].block_number).toBe(1)
			expect(results[0].value).toBe('test1')
			expect(results[1].block_number).toBe(2)
			expect(results[1].value).toBe('test2')
			expect(results[2].block_number).toBe(3)
			expect(results[2].value).toBe('test3')
			expect(results[3].block_number).toBe(3)
			expect(results[3].value).toBe('test4')
			expect(results[3].block_number).toBe(3)
			expect(results[3].value).toBe('test5')
		})
		it('If a number is duplicated, data is retrieved until the number is advanced. pert3.', async () => {
			const results = getTargetRecordsSeparatedByBlockNumber(param, 5)

			expect(results.length).toBe(5)
			expect(results[0].block_number).toBe(1)
			expect(results[0].value).toBe('test1')
			expect(results[1].block_number).toBe(2)
			expect(results[1].value).toBe('test2')
			expect(results[2].block_number).toBe(3)
			expect(results[2].value).toBe('test3')
			expect(results[3].block_number).toBe(3)
			expect(results[3].value).toBe('test4')
			expect(results[4].block_number).toBe(3)
			expect(results[4].value).toBe('test5')
		})
		it('If the number of records to be retrieved is the same as the number of records of the parameter, the parameter records are returned as they are.', async () => {
			const results = getTargetRecordsSeparatedByBlockNumber(param, 6)

			expect(results.length).toBe(6)
			expect(results[0].block_number).toBe(1)
			expect(results[0].value).toBe('test1')
			expect(results[1].block_number).toBe(2)
			expect(results[1].value).toBe('test2')
			expect(results[2].block_number).toBe(3)
			expect(results[2].value).toBe('test3')
			expect(results[3].block_number).toBe(3)
			expect(results[3].value).toBe('test4')
			expect(results[4].block_number).toBe(3)
			expect(results[4].value).toBe('test5')
			expect(results[4].block_number).toBe(4)
			expect(results[4].value).toBe('test6')
		})
	})
})
