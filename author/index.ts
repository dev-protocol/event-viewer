import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { ApiParams } from '../common/params'
import { getKarma } from './../common/karma/karma'

const httpTrigger: AzureFunction = async function (
	context: Context,
	req: HttpRequest
): Promise<void> {
	const params = new ApiParams(req)
	const karma = await getKarma(params.version, params.address)
	context.res = {
		status: 200,
		body: {
			address: params.address,
			karma: karma,
		},
		headers: {
			'Cache-Control': 'no-store',
		},
	}
}

export default httpTrigger
