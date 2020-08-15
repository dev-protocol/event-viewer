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

export async function getPropertyMetaInfo(
	version: string,
	address: string
): Promise<any> {
	const query = `{
		property_meta(
			where: {
				property: {
					_eq: "${address}"
				}
			}
			)
		{
			name
			symbol
			author
			block_number
			property
			sender
			total_supply
		}
	  }`
	const data = await postHasura(version, query)
	if (data.property_meta.length === 0) {
		throw new Error('address is not property')
	}

	return data.property_meta[0]
}
