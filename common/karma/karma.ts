import { MyPropertyDataStore } from './my-property'
import { MyPropertyBalanceDataStore } from './my-property-balance'
import { PropertyBalanceDataStore } from './property-balance'
import { PropertyLockupDataStore } from './property-lockup'
import { PropertyDataStore } from './property'
import { MyStakingDataStore } from './my-staking'
import BigNumber from 'bignumber.js'

export async function getKarma(
	version: string,
	authorAddress: string
): Promise<number> {
	const myStaking = new MyStakingDataStore()
	await myStaking.prepare(version, authorAddress)
	const result = new BigNumber(myStaking.stakingValue)
		.plus(await getMyPropertyStaking(version, authorAddress))
		.plus(await getPropertyStaking(version, authorAddress))
		.div(new BigNumber(1000000000000000000))
	return Number(result.toFixed(0))
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
