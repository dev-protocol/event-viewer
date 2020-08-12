import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import BigNumber from 'bignumber.js'
import { MyStakingDataStore } from './data/my-staking'
import { MyPropertyDataStore } from './data/my-property'
import { MyPropertyBalanceDataStore } from './data/my-property-balance'
import { PropertyBalanceDataStore } from './data/property-balance'
import { PropertyLockupDataStore } from './data/property-lockup'
import { PropertyDataStore } from './data/property'

const httpTrigger: AzureFunction = async function (
	context: Context,
	req: HttpRequest
): Promise<void> {
	const myStaking = new MyStakingDataStore(req)
	await myStaking.prepare()
	const result = new BigNumber(myStaking.stakingValue)
		.plus(await getMyPropertyStaking(req))
		.plus(await getPropertyStaking(req))
		.div(new BigNumber(1000000000000000000))
	context.res = {
		status: 200,
		body: { karma: Number(result.toFixed(0)) },
		headers: {
			'Cache-Control': 'no-store',
		},
	}
}

async function getPropertyStaking(req: HttpRequest): Promise<BigNumber> {
	const propertyBalance = new PropertyBalanceDataStore(req)
	await propertyBalance.prepare()
	const propertyAddresses = propertyBalance.getPropertyAddresses()
	const propertyInfo = new PropertyDataStore(req)
	await propertyInfo.prepare(propertyAddresses)
	const propertyLockup = new PropertyLockupDataStore(req)
	await propertyLockup.prepare(propertyAddresses)
	let sum = new BigNumber(0)
	for (let property of propertyAddresses) {
		const balance = new BigNumber(propertyBalance.getBlance(property))
		const totalSupply = propertyInfo.getTotalSupply(property)
		const lockupSumValues = new BigNumber(propertyLockup.getSumValues(property))
		sum = sum.plus(lockupSumValues.div(totalSupply).times(balance))
	}

	return sum
}

async function getMyPropertyStaking(req: HttpRequest): Promise<BigNumber> {
	const myPrperty = new MyPropertyDataStore(req)
	await myPrperty.prepare()
	const propertyAddresses = myPrperty.getPropertyAddresses()
	const propertyBalance = new MyPropertyBalanceDataStore(req)
	await propertyBalance.prepare(propertyAddresses)
	const propertyLockup = new PropertyLockupDataStore(req)
	await propertyLockup.prepare(propertyAddresses)

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
