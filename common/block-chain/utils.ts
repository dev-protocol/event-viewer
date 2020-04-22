import { Connection } from 'typeorm'
import {
	getContractInfo,
	getGroupContractInfo,
	getLegacyGroupContractInfo,
} from '../db/contract-info'

export async function getApprovalBlockNumber(web3: any): Promise<number> {
	const currentBlockNumber = await web3.eth.getBlockNumber()
	return currentBlockNumber - Number(process.env.APPROVAL!)
}

export async function getPropertyByMetrics(
	con: Connection,
	web3: any,
	metricsAddress: string
): Promise<string> {
	const metricsInfo = await getGroupContractInfo(con, 'Metrics')
	if (typeof metricsInfo === 'undefined') {
		throw new Error('metrics info is not found')
	}

	const recordMap = new Map(Object.entries(metricsInfo))

	const metricsInstance = await new web3.eth.Contract(
		JSON.parse(recordMap.get('group_contract_info_abi')),
		metricsAddress
	)
	const propertyAddress = await metricsInstance.methods.property().call()
	return propertyAddress
}

export async function getAuthenticationIdByMetrics(
	con: Connection,
	web3: any,
	marketAddress: string,
	metricsAddress: string
): Promise<string> {
	const marketAbi = await getGroupContractAbi(
		con,
		marketAddress,
		'Market',
		'IMarket'
	)
	const metricsInstance = await new web3.eth.Contract(
		JSON.parse(marketAbi),
		marketAddress
	)
	const behaviorAddress = await metricsInstance.methods.behavior().call()
	const behaviorAbi = await getGroupContractAbi(
		con,
		behaviorAddress,
		'MarketBehavior',
		'IMarketBehavior'
	)
	const behaviorInstance = await new web3.eth.Contract(
		JSON.parse(behaviorAbi),
		behaviorAddress
	)
	let id: string
	if (hasFunction(behaviorAbi, 'getId')) {
		id = await behaviorInstance.methods.getId(metricsAddress).call()
	} else if (hasFunction(behaviorAbi, 'getPackage')) {
		id = await behaviorInstance.methods.getPackage(metricsAddress).call()
	} else {
		throw new Error('not found get id function')
	}

	return id
}

export async function getPolicyInstance(
	con: Connection,
	web3: any
): Promise<any> {
	const info = await getContractInfo(con, 'AddressConfig')
	const recordMap = new Map(Object.entries(info))
	const addressConfigInstance = await new web3.eth.Contract(
		JSON.parse(recordMap.get('contract_info_abi')),
		recordMap.get('contract_info_address')
	)
	const policyAddress = await addressConfigInstance.methods.policy().call()
	const iPolicyAbi = await getGroupContractAbi(
		con,
		policyAddress,
		'Policy',
		'IPolicy'
	)
	const policyInstance = await new web3.eth.Contract(
		JSON.parse(iPolicyAbi),
		policyAddress
	)
	return policyInstance
}

function hasFunction(abi: string, funcName: string): boolean {
	const abiObject = JSON.parse(abi)
	for (let abiOneObject of abiObject) {
		if (abiOneObject.type !== 'function') {
			continue
		}

		if (abiOneObject.name === funcName) {
			return true
		}
	}

	return false
}

async function getGroupContractAbi(
	con: Connection,
	contractAddress: string,
	legacyName: string,
	groupName: string
): Promise<string> {
	let contractInfo = await getLegacyGroupContractInfo(
		con,
		legacyName,
		contractAddress
	)
	if (typeof contractInfo !== 'undefined') {
		const recordMap = new Map(Object.entries(contractInfo))
		return recordMap.get('legacy_group_contract_info_abi')
	}

	contractInfo = await getGroupContractInfo(con, groupName)
	if (typeof contractInfo === 'undefined') {
		throw new Error('target contract info is not found')
	}

	const recordMap = new Map(Object.entries(contractInfo))
	return recordMap.get('group_contract_info_abi')
}
