import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { RequestValidatorBuilder } from '../common/validator'
import { HasuraApiExecuter } from '../common/hasura-api'

class DataApi extends HasuraApiExecuter {
	addValidator(validatorBuilder: RequestValidatorBuilder): void {
		validatorBuilder.addJsonValidator()
		validatorBuilder.addQueryValidator()
	}

	getPostHeader(): object {
		return {
			'content-type': 'application/json',
			'x-hasura-role': process.env.HASERA_ROLE,
			'x-hasura-admin-secret': process.env.HASURA_SECRET!
		}
	}
}

const httpTrigger: AzureFunction = async function(
	context: Context,
	req: HttpRequest
): Promise<void> {
	const api = new DataApi(context, req)
	const res = await api.execute()

	context.res = {
		status: res.status,
		body: res.body
	}
}

export default httpTrigger
