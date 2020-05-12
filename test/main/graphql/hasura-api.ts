import { mocked } from 'ts-jest/utils'
import { getContextMock } from '../../lib/mock'
import { getHttpRequestMock } from '../../lib/http'
import axios, { AxiosResponse } from 'axios'
import { apiExecuterFactory } from '../../../graphql/hasura-api'

const context = getContextMock()

jest.mock('../../../common/notifications')
jest.mock('axios')

describe('apiExecuterFactory', () => {
	describe('SchemaApiExecuter', () => {
		it('If the content-type is not application/json, an error occurs.', async () => {
			const req = getHttpRequestMock(
				{},
				{ operationName: 'IntrospectionQuery' }
			)
			const apiExecuter = apiExecuterFactory(context, req)
			const result = await apiExecuter.execute()
			expect(result.status).toBe(415)
			expect(result.body).toBe('content-type is application/json only.')
		})
		it('An error is raised if there is no query information in the body.', async () => {
			const req = getHttpRequestMock(
				{ 'content-type': 'application/json' },
				{ operationName: 'IntrospectionQuery', hoge: 'dummy query' }
			)
			const apiExecuter = apiExecuterFactory(context, req)
			const result = await apiExecuter.execute()
			expect(result.status).toBe(400)
			expect(result.body).toBe('query only.')
		})
		it('If the query does not start with "query IntrospectionQuery", an error occurs.', async () => {
			const req = getHttpRequestMock(
				{ 'content-type': 'application/json' },
				{ operationName: 'IntrospectionQuery', query: 'dummy query' }
			)
			const apiExecuter = apiExecuterFactory(context, req)
			const result = await apiExecuter.execute()
			expect(result.status).toBe(400)
			expect(result.body).toBe('query error.')
		})
	})
	describe('EventApiExecuter', () => {
		it('If the content-type is not application/json, an error occurs.', async () => {
			const req = getHttpRequestMock({}, {})
			const apiExecuter = apiExecuterFactory(context, req)
			const result = await apiExecuter.execute()
			expect(result.status).toBe(415)
			expect(result.body).toBe('content-type is application/json only.')
		})
		it('An error is raised if there is no query information in the body.', async () => {
			const req = getHttpRequestMock(
				{ 'content-type': 'application/json' },
				{ hoge: 'dummy query' }
			)
			const apiExecuter = apiExecuterFactory(context, req)
			const result = await apiExecuter.execute()
			expect(result.status).toBe(400)
			expect(result.body).toBe('query only.')
		})
	})
	describe('common', () => {
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
			const apiExecuter = apiExecuterFactory(context, req)
			const result = await apiExecuter.execute()
			expect(result.status).toBe(400)
			expect(result.body).toBe('unknown error.')
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
			const apiExecuter = apiExecuterFactory(context, req)
			const result = await apiExecuter.execute()
			expect(result.status).toBe(200)
			expect(result.body).toBe('{hogehoge}')
		})
	})
})
