jest.mock('axios')
import axios from 'axios'
import {
	isNotEmpty,
	hasuraDataHeader,
	post,
	postHasura,
} from '../../../common/utils'
import { PostError } from '../../../common/error'

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

describe('hasuraDataHeader', () => {
	it('return header information.', async () => {
		process.env.HASERA_ROLE = 'dummy-role'
		process.env.HASURA_SECRET = 'dummy-secret'
		const result = hasuraDataHeader()
		expect(result['content-type']).toBe('application/json')
		expect(result['x-hasura-role']).toBe('dummy-role')
		expect(result['x-hasura-admin-secret']).toBe('dummy-secret')
	})
})

export class DummyPostError extends Error {
	get response(): { status: number; statusText: string } {
		return { status: 525, statusText: 'error message' }
	}
}

describe('post', () => {
	it('return request responce.', async () => {
		;(axios.post as any).mockResolvedValue({
			status: 200,
			data: {
				record: [1],
			},
		})
		const result = await post('dummy-url', {}, {})
		expect(result.status).toBe(200)
		expect(result.data.record[0]).toBe(1)
	})
	it('throw error when status code is not 200.', async () => {
		;(axios.post as any).mockResolvedValue({
			status: 400,
			data: {
				record: [1],
			},
		})
		await expect(post('dummy-url', {}, {})).rejects.toEqual(
			new PostError(400, 'unknown error.')
		)
	})
	it('throw error when responce data has serror information.', async () => {
		const dummyFunc = async () => {
			throw new DummyPostError()
		}

		;(axios.post as any).mockResolvedValue(dummyFunc())
		await expect(post('dummy-url', {}, {})).rejects.toEqual(
			new PostError(525, 'error message')
		)
	})
})

describe('postHasura', () => {
	it('return object data.', async () => {
		process.env.HASERA_REQUEST_DESTINATION = 'dummy-url'
		;(axios.post as any).mockResolvedValue({
			status: 200,
			data: '{"data": {"key": "dummy-key", "value": "dummy-value"}}',
		})
		const result = await postHasura('dummy-version', 'dummy-query')
		expect(result.key).toBe('dummy-key')
		expect(result.value).toBe('dummy-value')
	})
	it('throw error when response has error information.', async () => {
		process.env.HASERA_REQUEST_DESTINATION = 'dummy-url'
		;(axios.post as any).mockResolvedValue({
			status: 200,
			data: '{"errors": [{"message": "error message"}]}',
		})
		await expect(postHasura('dummy-version', 'dummy-query')).rejects.toEqual(
			new Error('error message')
		)
	})
})
