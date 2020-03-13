/* eslint-disable @typescript-eslint/camelcase */
import { AzureFunction, Context } from '@azure/functions'
import { ObjectType } from 'typeorm'
import { EventSaver } from '../common/base'
import { AllocatorAllocationResult } from '../entities/allocator-allocation-result'
import config from './config.json'
import abi from './abi.json'

class AllocationResultEventSaver extends EventSaver {
	getModelObject<Entity>(): ObjectType<Entity> {
		return AllocatorAllocationResult
	}

	// eslint-disable-next-line @typescript-eslint/no-untyped-public-signature
	getSaveData(event: Map<string, any>): any {
		const allocationResult = new AllocatorAllocationResult()
		const values = event.get('returnValues')
		allocationResult.metrics = values._metrics
		allocationResult.arg_value = values._value
		allocationResult.market = values._market
		allocationResult.property = values._property
		allocationResult.lockup_value = values._lockupValue
		allocationResult.result = values._result

		return allocationResult
	}

	getBatchName(): string {
		return 'allocator-allocation-result'
	}

	getContractAddress(): string {
		return config.contractAddress
	}

	// eslint-disable-next-line @typescript-eslint/no-untyped-public-signature
	getAbi(): any {
		return abi
	}

	getEventName(): string {
		return 'Allocation Result'
	}
}

const timerTrigger: AzureFunction = async function(
	context: Context,
	myTimer: any
): Promise<void> {
	const saver = new AllocationResultEventSaver(context, myTimer)
	await saver.execute()
}

export default timerTrigger
