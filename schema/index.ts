import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import url from 'url'
import { RequestValidatorBuilder } from '../common/validator'
import { HasuraApiExecuter } from '../common/hasura-api'

class SchemaApi extends HasuraApiExecuter {
	addValidator(validatorBuilder: RequestValidatorBuilder): void {
		validatorBuilder.addJsonValidator()
		validatorBuilder.addQueryValidator()
		validatorBuilder.addSchemaQueryValidator()
	}

	getPostHeader(): object {
		return {
			...this._req.headers,
			...{
				host: url.parse(process.env.HASERA_REQUEST_DESTINATION!).host,
				'x-hasura-admin-secret': process.env.HASURA_SECRET!
			}
		}
	}
}

const httpTrigger: AzureFunction = async function(
	context: Context,
	req: HttpRequest
): Promise<void> {
	const api = new SchemaApi(context, req)
	const res = await api.execute()
	context.res = {
		status: res.status,
		body: res.body
	}
}

export default httpTrigger
