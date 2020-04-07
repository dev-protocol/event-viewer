import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import axios, { Method } from 'axios'
import { AxiosResponse } from 'axios'
import urljoin from 'url-join'
import { EventSaverLogging } from '../common/notifications'
import { RequestValidatorBuilder, ValidateError } from './validator'

const httpTrigger: AzureFunction = async function(
	context: Context,
	req: HttpRequest
): Promise<void> {
	// Validate
	const logging = new EventSaverLogging(context.log, 'event-data')
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

		logging.error(e.message)
		throw e
	}

	// Request
	let res: AxiosResponse
	try {
		res = await axios({
			method: req.method as Method,
			url: urljoin(
				process.env.HASERA_REQUEST_URL!,
				req.params.version,
				req.params.language
			),
			data: req.body,
			headers: {
				...req.headers,
				...{
					'content-type': 'application/json',
					'x-hasura-role': process.env.HASERA_ROLE,
					'x-hasura-admin-secret': process.env.HASURA_SECRET!
				}
			}
		})
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

	const { status, headers, data: body } = res
	context.res = {
		status,
		headers,
		body
	}
}

export default httpTrigger
