import { AzureFunction, Context, HttpRequest } from '@azure/functions'
// Import { HasuraRequest } from './request'

const httpTrigger: AzureFunction = async function (
	context: Context,
	_req: HttpRequest
): Promise<void> {
	// Const request = new HasuraRequest(req)

	context.res = {
		status: 200,
		body: 'hogehoge',
		headers: {
			'Cache-Control': 'no-store',
		},
	}
}

export default httpTrigger
