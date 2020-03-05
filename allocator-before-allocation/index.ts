/* eslint-disable @typescript-eslint/camelcase */
import { AzureFunction, Context } from '@azure/functions'
import { ObjectType } from 'typeorm'
import { EventSaver } from '../common/base'
import { AllocatorBeforeAllocation } from '../entities/allocator-before-allocation'
import config from './config.json'
import abi from './abi.json'

class BeforeAllocationEventSaver extends EventSaver {
	getModelObject<Entity>(): ObjectType<Entity> {
		return AllocatorBeforeAllocation
	}

	// eslint-disable-next-line @typescript-eslint/no-untyped-public-signature
	getSaveData(event: Map<string, any>): any {
		const beforeAllocation = new AllocatorBeforeAllocation()
		const values = event.get('returnValues')
		beforeAllocation.blocks = values._blocks
		beforeAllocation.mint = values._mint
		beforeAllocation.token_value = values._value
		beforeAllocation.market_value = values._marketValue
		beforeAllocation.assets = values._assets
		beforeAllocation.total_assets = values._totalAssets

		return beforeAllocation
	}

	getBatchName(): string {
		return 'allocator-before-allocation'
	}

	getContractAddress(): string {
		return config.contractAddress
	}

	// eslint-disable-next-line @typescript-eslint/no-untyped-public-signature
	getAbi(): any {
		return abi
	}

	getEventName(): string {
		return 'BeforeAllocation'
	}
}

const timerTrigger: AzureFunction = async function(
	context: Context,
	myTimer: any
): Promise<void> {
	const saver = new BeforeAllocationEventSaver(context, myTimer)
	await saver.execute()
}

export default timerTrigger
