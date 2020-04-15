import { Connection } from 'typeorm'
import {
	GroupContractInfoAccessor,
	LegacyGroupContractInfoAccessor
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
	const accessor = new GroupContractInfoAccessor(con)
	const metricsInfo = await accessor.getContractInfo('Metrics')
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
	console.log('**********************************1')
	const metricsInstance = await new web3.eth.Contract(
		JSON.parse(marketAbi),
		marketAddress
	)
	console.log('**********************************2')
	const behaviorAddress = await metricsInstance.methods.behavior().call()
	console.log('**********************************3')
	const behaviorAbi = await getGroupContractAbi(
		con,
		marketAddress,
		'MarketBehavior',
		'IMarketBehavior'
	)
	console.log(behaviorAddress)
	console.log(behaviorAbi)
	console.log('**********************************4')
	const behaviorInstance = await new web3.eth.Contract(
		JSON.parse(behaviorAbi),
		behaviorAddress
	)
	console.log('**********************************5')
	let id: string
	if (hasFunction(behaviorAbi, 'getId')) {
		id = await behaviorInstance.methods.getId(metricsAddress).call()
	} else if (hasFunction(behaviorAbi, 'getPackage')) {
		id = await behaviorInstance.methods.getPackage(metricsAddress).call()
	} else {
		throw new Error('not found get id function')
	}

	console.log('**********************************6')
	return id
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
	const legacyAccessor = new LegacyGroupContractInfoAccessor(con)
	let contractInfo = await legacyAccessor.getContractInfo(
		legacyName,
		contractAddress
	)
	if (typeof contractInfo !== 'undefined') {
		const recordMap = new Map(Object.entries(contractInfo))
		return recordMap.get('legacy_group_contract_info_abi')
	}

	const groupAccessor = new GroupContractInfoAccessor(con)
	contractInfo = await groupAccessor.getContractInfo(groupName)
	if (typeof contractInfo === 'undefined') {
		throw new Error('target contract info is not found')
	}

	const recordMap = new Map(Object.entries(contractInfo))
	return recordMap.get('group_contract_info_abi')
}
