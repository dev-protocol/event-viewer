import config from './config.json'
import { ObjectType } from 'typeorm'
import { EventSaver } from 'src/batch/event/common/base'
import { AllocatorBeforeAllocation } from 'src/entities/allocator-before-allocation'

class BeforeAllocationSaver extends EventSaver {
	// eslint-disable-next-line @typescript-eslint/no-untyped-public-signature
	getSaveData(event: Map<string, any>): any {
		const beforeAllocation = new AllocatorBeforeAllocation()
		const values = event.get('returnValues')
		beforeAllocation.blocks = values._blocks
		beforeAllocation.mint = values._mint
		// eslint-disable-next-line @typescript-eslint/camelcase
		beforeAllocation.token_value = values._value
		// eslint-disable-next-line @typescript-eslint/camelcase
		beforeAllocation.market_value = values._marketValue
		beforeAllocation.assets = values._assets
		// eslint-disable-next-line @typescript-eslint/camelcase
		beforeAllocation.total_assets = values._totalAssets

		return beforeAllocation
	}

	getTableName(): string {
		return 'allocator_before_allocation'
	}

	getModelObject<Entity>(): ObjectType<Entity> {
		return AllocatorBeforeAllocation
	}

	getContractAddress(): string {
		return config.contractAddress
	}

	getEventName(): string {
		return 'BeforeAllocation'
	}

	getDirPath(): string {
		return __dirname
	}
}

async function main(): Promise<void> {
	const saver = new BeforeAllocationSaver()
	await saver.execute()
}

main()
