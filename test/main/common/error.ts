import { PostError } from '../../../common/error'

describe('PostError', () => {
	it('we can get information on the error.', async () => {
		const error = new PostError(400, 'error message')
		expect(error.message).toBe('error message')
		expect(error.status).toBe(400)
	})
})
