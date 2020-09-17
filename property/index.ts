import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { ApiParams } from '../common/params'
import { getKarma } from './../common/karma/karma'
import { postHasura } from '../common/utils'

const httpTrigger: AzureFunction = async function (
	context: Context,
	req: HttpRequest
): Promise<void> {
	const params = new ApiParams(req)
	const propertyMeta = await getPropertyMetaInfo(params.version, params.address)
	const karma = await getKarma(params.version, propertyMeta.author)
	context.res = {
		status: 200,
		body: {
			name: propertyMeta.name,
			symbol: propertyMeta.symbol,
			author: {
				address: propertyMeta.author,
				karma: karma,
			},
			block_number: propertyMeta.block_number,
			sender: propertyMeta.sender,
			total_supply: propertyMeta.total_supply,
			property: propertyMeta.property,
		},
		headers: {
			'Cache-Control': 'no-store',
		},
	}
}

async function getPropertyMetaInfo(
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

export default httpTrigger
