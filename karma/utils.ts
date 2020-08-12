import urljoin from 'url-join'
import { post, hasuraDataHeader } from '../common/utils'

function hasuraUrl(version: string): string {
	return urljoin(process.env.HASERA_REQUEST_DESTINATION!, version, 'graphql')
}

export async function postHasura(version: string, query: string): Promise<any> {
	const body = {
		query: query,
	}
	const res = await post(hasuraUrl(version), body, hasuraDataHeader())
	const data = JSON.parse(res.data)
	if (data.errors) {
		throw new Error(data.errors[0].message)
	}

	return data.data
}
