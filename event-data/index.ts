import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import axios from 'axios'
import { RequestValidatorBuilder, ValidateError } from './validator'

const httpTrigger: AzureFunction = async function(
	context: Context,
	req: HttpRequest
): Promise<void> {
	// Validate
	const validatorBuilder = new RequestValidatorBuilder(req)
	validatorBuilder.addJsonValidator()
	validatorBuilder.addQueryValidator()
	try {
		validatorBuilder.build().execute()
	} catch (e) {
		if (e instanceof ValidateError) {
			context.res = {
				status: e.status,
				body: e.message
			}
			return
		}

		throw e
	}

	// Request
	const res = await axios.post(
		process.env.HASERA_REQUEST_URL!,
		{
			query: req.body.query
		},
		{
			headers: {
				'content-type': 'application/json',
				'x-hasura-role': process.env.HASERA_ROLE,
				'x-hasura-admin-secret': process.env.HASURA_SECRET!
			}
		}
	)

	// Response
	if (res.status !== 200 || typeof res.data.errors !== 'undefined') {
		context.res = {
			status: 400,
			body: 'unknown error'
		}
		console.log(res)
		return
	}

	context.res = {
		body: res.data
	}
}

export default httpTrigger
