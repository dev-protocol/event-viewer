import urljoin from 'url-join'
import { HttpRequest } from '@azure/functions'
import { post, hasuraDataHeader } from './../common/utils'

export class HasuraRequest {
	private readonly _url: string
	constructor(req: HttpRequest) {
		this._url = urljoin(
			process.env.HASERA_REQUEST_DESTINATION!,
			req.params.version,
			'karma'
		)
	}

	async post(query: string): Promise<any> {
		const body = {
			query: query,
		}
		const res = await post(this._url, body, hasuraDataHeader())
		return res.data
	}
}
