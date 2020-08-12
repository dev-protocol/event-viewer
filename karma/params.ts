import { HttpRequest } from '@azure/functions'
import Web3 from 'web3'
import { postHasura } from './utils'

export class KarmaParams {
	private readonly _req: HttpRequest
	private _address: string
	private _version: string
	constructor(req: HttpRequest) {
		this._req = req
	}

	async analysisRequest(): Promise<void> {
		const web3 = new Web3()
		if (!web3.utils.isAddress(this._req.params.address)) {
			throw new Error('illegal address')
		}

		const [isPropertyAddress, author] = await this.getAuthor()
		this._address = isPropertyAddress ? author : this._req.params.address
		this._version = this._req.params.version
	}

	private async getAuthor(): Promise<[boolean, string]> {
		const query = `{
			property_meta(
				where: {
					property: {
						_eq: "${this._req.params.address}"
					}
				}
				)
			{
			  author
			}
		  }`
		const data = await postHasura(this._req.params.version, query)
		if (data.property_meta.length === 0) {
			return [false, undefined]
		}

		return [true, data.property_meta[0].author]
	}

	get address(): string {
		return this._address
	}

	get version(): string {
		return this._version
	}
}
