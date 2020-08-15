import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import BigNumber from 'bignumber.js'
import { MyStakingDataStore } from './data/my-staking'
import { MyPropertyDataStore } from './data/my-property'
import { MyPropertyBalanceDataStore } from './data/my-property-balance'
import { PropertyBalanceDataStore } from './data/property-balance'
import { PropertyLockupDataStore } from './data/property-lockup'
import { PropertyDataStore } from './data/property'
import { ApiParams } from './params'
import { getPropertyMetaInfo } from './utils'

const httpTrigger: AzureFunction = async function (
	context: Context,
	req: HttpRequest
): Promise<void> {
	const params = new ApiParams(req)
	const propertyMeta = await getPropertyMetaInfo(params.version, params.address)
	const myStaking = new MyStakingDataStore()
	await myStaking.prepare(params.version, propertyMeta.author)
	const result = new BigNumber(myStaking.stakingValue)
		.plus(await getMyPropertyStaking(params.version, propertyMeta.author))
		.plus(await getPropertyStaking(params.version, propertyMeta.author))
		.div(new BigNumber(1000000000000000000))
	context.res = {
		status: 200,
		body: {
			name: propertyMeta.name,
			symbol: propertyMeta.symbol,
			author: {
				address: propertyMeta.author,
				karma: Number(result.toFixed(0)),
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

async function getPropertyStaking(
	version: string,
	address: string
): Promise<BigNumber> {
	const propertyBalance = new PropertyBalanceDataStore()
	await propertyBalance.prepare(version, address)
	const propertyAddresses = propertyBalance.getPropertyAddresses()
	const propertyInfo = new PropertyDataStore()
	await propertyInfo.prepare(version, propertyAddresses)
	const propertyLockup = new PropertyLockupDataStore()
	await propertyLockup.prepare(version, propertyAddresses)
	let sum = new BigNumber(0)
	for (let property of propertyAddresses) {
		const balance = new BigNumber(propertyBalance.getBlance(property))
		const totalSupply = propertyInfo.getTotalSupply(property)
		const lockupSumValues = new BigNumber(propertyLockup.getSumValues(property))
		sum = sum.plus(lockupSumValues.div(totalSupply).times(balance))
	}

	return sum
}

async function getMyPropertyStaking(
	version: string,
	address: string
): Promise<BigNumber> {
	const myPrperty = new MyPropertyDataStore()
	await myPrperty.prepare(version, address)
	const propertyAddresses = myPrperty.getPropertyAddresses()
	const propertyBalance = new MyPropertyBalanceDataStore()
	await propertyBalance.prepare(version, address, propertyAddresses)
	const propertyLockup = new PropertyLockupDataStore()
	await propertyLockup.prepare(version, propertyAddresses)

	let sum = new BigNumber(0)
	for (let property of propertyAddresses) {
		const totalSupply = new BigNumber(myPrperty.getTotalSupply(property))
		const balance = new BigNumber(
			propertyBalance.getBlance(property, totalSupply.toNumber())
		)
		const lockupSumValues = new BigNumber(propertyLockup.getSumValues(property))
		sum = sum.plus(lockupSumValues.div(totalSupply).times(balance))
	}

	return sum
}

export default httpTrigger
