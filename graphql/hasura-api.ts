import { Context, HttpRequest } from '@azure/functions'
import axios from 'axios'
import { AxiosResponse } from 'axios'
import url from 'url'
import urljoin from 'url-join'
import { EventSaverLogging } from '../common/notifications'
import { isNotEmpty } from '../common/utils'
import { RequestValidatorBuilder, ValidateError } from './validator'

interface ApiExecuter {
	execute(): Promise<any>
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
		const logging = new EventSaverLogging(
			this._context.log,
			this._getFuncName()
		)
		let status_ = 200
		let body_ = {}
		try {
			this._validate()
			const res = await this._post()
			body_ = res.data
		} catch (err) {
			this._context.log.error(err.stack)
			await logging.error(err.message)
			if (err instanceof ValidateError || err instanceof PostError) {
				status_ = err.status
				body_ = err.message
			} else {
				status_ = 400
				body_ = 'unknown error'
			}
		}

		return { status: status_, body: body_ }
	}

	private async _post(): Promise<AxiosResponse> {
		let res: AxiosResponse
		try {
			res = await axios.post(
				urljoin(
					process.env.HASERA_REQUEST_DESTINATION!,
					this._req.params.version,
					this._req.params.language
				),
				{
					query: this._req.body.query
				},
				{
					headers: this.getPostHeader()
				}
			)
		} catch (e) {
			throw new PostError(e.response.status, e.response.statusText)
		}

		if (res.status !== 200 || typeof res.data.errors !== 'undefined') {
			throw new PostError(400, 'unknown error')
		}

		return res
	}

	private _validate(): void {
		const validatorBuilder = new RequestValidatorBuilder(this._req)
		this.addValidator(validatorBuilder)
		validatorBuilder.build().execute()
	}

	private _getFuncName(): string {
		if (isNotEmpty(this._context.executionContext.functionName)) {
			return this._context.executionContext.functionName
		}

		if (isNotEmpty(this._context.bindingData.sys.methodName)) {
			return this._context.bindingData.sys.methodName
		}

		return 'hasura http func'
	}

	abstract addValidator(validatorBuilder: RequestValidatorBuilder): void
	abstract getPostHeader(): object
}

class EventApiExecuter extends HasuraApiExecuter {
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

class SchemaApiExecuter extends HasuraApiExecuter {
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

class PostError extends Error {
	_status: number
	constructor(status: number, m: string) {
		super(m)
		this._status = status
	}

	get status(): number {
		return this._status
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
