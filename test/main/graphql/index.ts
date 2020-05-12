import { mocked } from 'ts-jest/utils'
import { getContextMock } from '../../lib/mock'
import { getHttpRequestMock } from '../../lib/http'
import axios, { AxiosResponse } from 'axios'
import httpTrigger from '../../../graphql/index'

const context = getContextMock()

jest.mock('../../../common/notifications')
jest.mock('axios')

describe('apiExecuterFactory', () => {
	it('If the POST request is in error, an error occurs.', async () => {
		const axiosErrorResponse: AxiosResponse = {
			data: '{hogehoge}',
			status: 404,
			statusText: 'NG',
			config: {},
			headers: {},
		}
		mocked(axios.post).mockImplementation(async () =>
			Promise.resolve(axiosErrorResponse)
		)
		process.env.HASERA_REQUEST_DESTINATION = 'https://hogehoge'
		const req = getHttpRequestMock(
			{ 'content-type': 'application/json' },
			{
				operationName: 'IntrospectionQuery',
				query: 'query IntrospectionQuery',
			},
			{
				version: 'v1',
				language: 'graphql',
			}
		)
		await httpTrigger(context, req)
		expect(context.res.status).toBe(400)
		expect(context.res.body).toBe('unknown error.')
		const headers = new Map(Object.entries(context.res.headers))
		expect(headers.get('Cache-Control')).toBe('no-store')
	})
	it('If the post request is successfully completed, the data is returned.', async () => {
		const axiosSuccessResponse: AxiosResponse = {
			data: '{hogehoge}',
			status: 200,
			statusText: 'OK',
			config: {},
			headers: {},
		}
		mocked(axios.post).mockImplementation(async () =>
			Promise.resolve(axiosSuccessResponse)
		)
		process.env.HASERA_REQUEST_DESTINATION = 'https://hogehoge'
		const req = getHttpRequestMock(
			{ 'content-type': 'application/json' },
			{
				operationName: 'IntrospectionQuery',
				query: 'query IntrospectionQuery',
			},
			{
				version: 'v1',
				language: 'graphql',
			}
		)
		await httpTrigger(context, req)
		expect(context.res.status).toBe(200)
		expect(context.res.body).toBe('{hogehoge}')
		const headers = new Map(Object.entries(context.res.headers))
		expect(headers.get('Cache-Control')).toBe('no-store')
	})
})
