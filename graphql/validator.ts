import { HttpRequest } from '@azure/functions'

export class RequestValidatorBuilder {
	_validator: RequestValidator
	constructor(req: HttpRequest) {
		this._validator = new RequestValidator(req)
	}

	public addJsonValidator(): void {
		this._validator.addValidator(new JsonValidator())
	}

	public addQueryValidator(): void {
		this._validator.addValidator(new QueryValidator())
	}

	public addSchemaQueryValidator(): void {
		this._validator.addValidator(new SchemaQueryValidator())
	}

	public build(): RequestValidator {
		return this._validator
	}
}

class RequestValidator {
	_req: HttpRequest
	_validators: Validator[]
	constructor(req: HttpRequest) {
		this._req = req
		this._validators = []
	}

	public addValidator(validator: Validator): void {
		this._validators.push(validator)
	}

	public execute(): void {
		this._validators.forEach((validator) => {
			validator.execute(this._req)
		})
	}
}

export class ValidateError extends Error {
	_status: number
	constructor(status: number, m: string) {
		super(m)
		this._status = status
	}

	get status(): number {
		return this._status
	}
}

interface Validator {
	execute: (req: HttpRequest) => void
}

class JsonValidator implements Validator {
	public execute(req: HttpRequest): void {
		const contentType = req.headers['content-type']
		if (contentType === 'application/json') {
			return
		}

		throw new ValidateError(415, 'content-type is application/json only')
	}
}

class QueryValidator implements Validator {
	public execute(req: HttpRequest): void {
		if ('query' in req.body) {
			return
		}

		throw new ValidateError(400, 'query only')
	}
}

class SchemaQueryValidator implements Validator {
	public execute(req: HttpRequest): void {
		if (req.body.query.startsWith('query IntrospectionQuery')) {
			return
		}

		throw new ValidateError(400, 'query error')
	}
}
