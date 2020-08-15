import { HttpRequest } from '@azure/functions'
import Web3 from 'web3'

export class ApiParams {
	private readonly _address: string
	private readonly _version: string
	constructor(req: HttpRequest) {
		this._address = this._getAddressFromRequest(req)
		this._version = req.params.version
	}

	_getAddressFromRequest(req: HttpRequest): string {
		const web3 = new Web3()
		if (!web3.utils.isAddress(req.params.address)) {
			throw new Error('illegal address')
		}

		return req.params.address
	}

	get address(): string {
		return this._address
	}

	get version(): string {
		return this._version
	}
}
