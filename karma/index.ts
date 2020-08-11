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
	context.res = {
		status: 200,
		body: { karma: result.toFixed },
		headers: {
			'Cache-Control': 'no-store',
		},
	}
}

async function getPropertyStaking(req: HttpRequest): Promise<BigNumber> {
	const propertyBalance = new PropertyBalanceDataStore(req)
	await propertyBalance.prepare()
	const propertyInfo = new PropertyDataStore(req)
	await propertyInfo.prepare(propertyBalance.getPropertyAddresses())
	const propertyLockup = new PropertyLockupDataStore(req)
	await propertyLockup.prepare(propertyBalance.getPropertyAddresses())
	let sum = new BigNumber(0)
	for (let property of propertyBalance.getPropertyAddresses()) {
		const balance = new BigNumber(propertyBalance.getBlance(property))
		const totalSupply = propertyInfo.getTotalSupply(property)
		const lockupSumValues = new BigNumber(propertyLockup.getSumValues(property))
		sum.plus(lockupSumValues.div(totalSupply).times(balance))
	}

	return sum
}

async function getMyPropertyStaking(req: HttpRequest): Promise<BigNumber> {
	const myPrperty = new MyPropertyDataStore(req)
	await myPrperty.prepare()
	const propertyBalance = new MyPropertyBalanceDataStore(req)
	console.log(myPrperty.getPropertyAddresses())
	await propertyBalance.prepare(myPrperty.getPropertyAddresses())
	const propertyLockup = new PropertyLockupDataStore(req)
	await propertyLockup.prepare(myPrperty.getPropertyAddresses())

	let sum = new BigNumber(0)
	for (let property of myPrperty.getPropertyAddresses()) {
		const totalSupply = new BigNumber(myPrperty.getTotalSupply(property))

		const balance = new BigNumber(
			propertyBalance.getBlance(property, totalSupply.toNumber())
		)
		const lockupSumValues = new BigNumber(propertyLockup.getSumValues(property))
		sum.plus(lockupSumValues.div(totalSupply).times(balance))
	}

	return sum
}

export default httpTrigger
