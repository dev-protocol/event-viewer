import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import axios from 'axios'
import { AxiosResponse } from 'axios'
import urljoin from 'url-join'
import url from 'url'
import { EventSaverLogging } from '../common/notifications'
import { RequestValidatorBuilder, ValidateError } from '../common/validator'

const httpTrigger: AzureFunction = async function(
	context: Context,
	req: HttpRequest
): Promise<void> {
	// Validate
	const logging = new EventSaverLogging(context.log, 'schema')
	const validatorBuilder = new RequestValidatorBuilder(req)
	validatorBuilder.addJsonValidator()
	validatorBuilder.addQueryValidator()
	validatorBuilder.addSchemaQueryValidator()
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

		logging.error(e.message)
		throw e
	}

	// Request
	let res: AxiosResponse
	try {
		res = await axios.post(
			urljoin(
				process.env.HASERA_REQUEST_DESTINATION!,
				req.params.version,
				req.params.language
			),
			{
				query: req.body.query
			},
			{
				headers: {
					...req.headers,
					...{
						host: url.parse(process.env.HASERA_REQUEST_DESTINATION!).host,
						'x-hasura-admin-secret': process.env.HASURA_SECRET!
					}
				}
			}
		)
	} catch (e) {
		context.res = {
			status: e.response.status,
			body: e.response.statusText
		}
		return
	}

	// Response
	if (res.status !== 200 || typeof res.data.errors !== 'undefined') {
		context.res = {
			status: 400,
			body: 'unknown error'
		}
		logging.error(res.statusText)
		return
	}

	context.res = {
		body: res.data
	}
}

export default httpTrigger
