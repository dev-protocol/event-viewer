import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { apiExecuterFactory } from './hasura-api'

const httpTrigger: AzureFunction = async function (
	context: Context,
	req: HttpRequest
): Promise<void> {
	const apiExecuter = apiExecuterFactory(context, req)
	const res = await apiExecuter.execute()

	context.res = {
		status: res.status,
		body: res.body,
	}
}

export default httpTrigger
