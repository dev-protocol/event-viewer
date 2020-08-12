import urljoin from 'url-join'
import { HttpRequest } from '@azure/functions'
import { post, hasuraDataHeader } from '../common/utils'

function hasuraUrl(req: HttpRequest): string {
	return urljoin(
		process.env.HASERA_REQUEST_DESTINATION!,
		req.params.version,
		'graphql'
	)
}

export async function postHasura(
	req: HttpRequest,
	query: string
): Promise<any> {
	const body = {
		query: query,
	}
	const res = await post(hasuraUrl(req), body, hasuraDataHeader())
	const data = JSON.parse(res.data)
	if (data.errors) {
		throw new Error(data.errors[0].message)
	}

	return data.data
}
