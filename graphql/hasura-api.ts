import { Context, HttpRequest } from '@azure/functions'
import url from 'url'
import urljoin from 'url-join'
import { post, hasuraDataHeader } from '../common/utils'
import { PostError } from '../common/error'
import { RequestValidatorBuilder, ValidateError } from './validator'

interface ApiExecuter {
	execute: () => Promise<any>
}

abstract class HasuraApiExecuter implements ApiExecuter {
	private readonly _context: Context
	// eslint-disable-next-line @typescript-eslint/member-ordering
	protected readonly _req: HttpRequest

	constructor(context: Context, req: HttpRequest) {
		this._context = context
		this._req = req
	}

	public async execute(): Promise<any> {
		let status_ = 200
		let body_ = {}
		try {
			this._validate()
			const url = urljoin(
				process.env.HASERA_REQUEST_DESTINATION!,
				this._req.params.version,
				this._req.params.language
			)
			const res = await post(url, this._req.body, this.getPostHeader())
			body_ = res.data
		} catch (err) {
			this._context.log.error(err.stack)
			if (err instanceof ValidateError || err instanceof PostError) {
				status_ = err.status
				body_ = err.message
			} else {
				status_ = 400
				body_ = 'unknown error.'
			}
		}

		return { status: status_, body: body_ }
	}

	private _validate(): void {
		const validatorBuilder = new RequestValidatorBuilder(this._req)
		this.addValidator(validatorBuilder)
		validatorBuilder.build().execute()
	}

	abstract addValidator(validatorBuilder: RequestValidatorBuilder): void
	abstract getPostHeader(): Record<string, unknown>
}

class EventApiExecuter extends HasuraApiExecuter {
	addValidator(validatorBuilder: RequestValidatorBuilder): void {
		validatorBuilder.addJsonValidator()
		validatorBuilder.addQueryValidator()
	}

	getPostHeader(): Record<string, unknown> {
		return hasuraDataHeader()
	}
}

class SchemaApiExecuter extends HasuraApiExecuter {
	addValidator(validatorBuilder: RequestValidatorBuilder): void {
		validatorBuilder.addJsonValidator()
		validatorBuilder.addQueryValidator()
		validatorBuilder.addSchemaQueryValidator()
	}

	getPostHeader(): Record<string, unknown> {
		return {
			...this._req.headers,
			...{
				host: url.parse(process.env.HASERA_REQUEST_DESTINATION!).host,
				'x-hasura-admin-secret': process.env.HASURA_SECRET!,
			},
		}
	}
}

export function apiExecuterFactory(
	context: Context,
	req: HttpRequest
): ApiExecuter {
	if (req.body.operationName === 'IntrospectionQuery') {
		return new SchemaApiExecuter(context, req)
	}

	return new EventApiExecuter(context, req)
}
