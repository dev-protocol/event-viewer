import { AxiosResponse } from 'axios'
import axios from 'axios'
import { PostError } from './error'
import urljoin from 'url-join'

export function isNotEmpty(str: string): boolean {
	if (typeof str === 'undefined') {
		return false
	}

	if (str === null) {
		return false
	}

	if (str === '') {
		return false
	}

	return true
}

export async function post(
	url: string,
	body: any,
	headers: any
): Promise<AxiosResponse> {
	let res: AxiosResponse
	try {
		res = await axios.post(
			url,
			{
				...body,
			},
			{
				headers: headers,
				transformResponse: (res) => {
					return res
				},
				responseType: 'json',
			}
		)
	} catch (e) {
		throw new PostError(e.response.status, e.response.statusText)
	}

	if (res.status !== 200 || typeof res.data.errors !== 'undefined') {
		throw new PostError(400, 'unknown error.')
	}

	return res
}

export function hasuraDataHeader(): Record<string, unknown> {
	return {
		'content-type': 'application/json',
		'x-hasura-role': process.env.HASERA_ROLE,
		'x-hasura-admin-secret': process.env.HASURA_SECRET!,
	}
}

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
