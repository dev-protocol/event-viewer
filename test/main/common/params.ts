import { ApiParams } from '../../../common/params'

describe('ApiParams', () => {
	it('Request parameters can be obtained.', async () => {
		const request = {
			params: {
				address: '0x1D415aa39D647834786EB9B5a333A50e9935b796',
				version: 'v1',
			},
		}
		const params = new ApiParams(request as any)
		expect(params.address).toBe('0x1D415aa39D647834786EB9B5a333A50e9935b796')
		expect(params.version).toBe('v1')
	})
	it('An error occurs when an invalid address is used.', async () => {
		const request = {
			params: {
				address: '0x1212',
				version: 'v1',
			},
		}
		function tmpFunction() {
			// eslint-disable-next-line no-new
			new ApiParams(request as any)
		}

		expect(tmpFunction).toThrowError(new Error('illegal address'))
	})
})
