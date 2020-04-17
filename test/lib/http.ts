import { HttpRequest } from '@azure/functions'

export function getHttpRequestMock(
	headersArg: {
		[key: string]: string
	},
	bodyArg: any
): HttpRequest {
	const mockHttpReq: HttpRequest = {
		method: 'POST',
		url: 'https://dummy-domein',
		headers: headersArg,
		query: {},
		params: {},
		body: bodyArg,
		rawBody: undefined,
	}
	return mockHttpReq
}
