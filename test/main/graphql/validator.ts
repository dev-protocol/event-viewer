import {
	ValidateError,
	RequestValidatorBuilder
} from '../../../graphql/validator'
import { getHttpRequestMock } from '../../lib/http'

describe('ValidateError', () => {
	it('The set status code and error messages can be retrieved.', async () => {
		const error = new ValidateError(400, 'error message')
		expect(error.message).toBe('error message')
		expect(error.status).toBe(400)
	})
})

describe('RequestValidatorBuilder', () => {
	describe('addJsonValidator', () => {
		it('If the content-type is application/json, no error will occur.', async () => {
			const req = getHttpRequestMock({ 'content-type': 'application/json' }, {})
			const validateBuilder = new RequestValidatorBuilder(req)
			validateBuilder.addJsonValidator()
			validateBuilder.build().execute()
		})
		it('If the content-type is not application/json, an error is raised.', async () => {
			const req = getHttpRequestMock(
				{ 'content-type': 'multipart/form-data' },
				{}
			)
			const validateBuilder = new RequestValidatorBuilder(req)
			validateBuilder.addJsonValidator()
			const validator = validateBuilder.build()
			const t = (): void => {
				validator.execute()
			}

			expect(t).toThrowError(
				new ValidateError(415, 'content-type is application/json only')
			)
		})
	})
	describe('addQueryValidator', () => {
		it('If the body is a query, no error will occur.', async () => {
			const req = getHttpRequestMock({}, { query: 'dummy query' })
			const validateBuilder = new RequestValidatorBuilder(req)
			validateBuilder.addQueryValidator()
			validateBuilder.build().execute()
		})
		it('If the body is not a query, an error is raised.', async () => {
			const req = getHttpRequestMock({}, { mutation: 'dummy mutation' })
			const validateBuilder = new RequestValidatorBuilder(req)
			validateBuilder.addQueryValidator()
			const validator = validateBuilder.build()
			const t = (): void => {
				validator.execute()
			}

			expect(t).toThrowError(new ValidateError(415, 'query only'))
		})
	})
	describe('SchemaQueryValidator', () => {
		it('If operationName is "IntrospectionQuery" and query starts with "query IntrospectionQuery", no error will occur.', async () => {
			const req = getHttpRequestMock(
				{},
				{
					query: 'query IntrospectionQuery hogehoge'
				}
			)
			const validateBuilder = new RequestValidatorBuilder(req)
			validateBuilder.addSchemaQueryValidator()
			validateBuilder.build().execute()
		})
		it('If the query does not start with "query IntrospectionQuery", an error occurs.', async () => {
			const req = getHttpRequestMock(
				{},
				{
					query: 'query hogehoge'
				}
			)
			const validateBuilder = new RequestValidatorBuilder(req)
			validateBuilder.addSchemaQueryValidator()
			const validator = validateBuilder.build()
			const t = (): void => {
				validator.execute()
			}

			expect(t).toThrowError(new ValidateError(400, 'query error'))
		})
	})
})
