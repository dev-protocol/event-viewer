import config from './config.json'
import { ObjectType } from 'typeorm'
import { EventSaver } from 'src/batch/event/common/base'
import { BeforeAllocation } from 'src/entities/BeforeAllocation'

class AllocatorBeforeAllocationSaver extends EventSaver {
	// eslint-disable-next-line @typescript-eslint/no-untyped-public-signature
	getSaveData(event: Map<string, any>): any {
		const beforeAllocation = new BeforeAllocation()
		const values = event.get('returnValues')
		beforeAllocation.blocks = values._blocks
		beforeAllocation.mint = values._mint
		beforeAllocation.value = values._value
		// eslint-disable-next-line @typescript-eslint/camelcase
		beforeAllocation.market_value = values._marketValue
		beforeAllocation.assets = values._assets
		// eslint-disable-next-line @typescript-eslint/camelcase
		beforeAllocation.total_assets = values._totalAssets

		return beforeAllocation
	}

	getBatchName(): string {
		return AllocatorBeforeAllocationSaver.name
	}

	getModelObject<Entity>(): ObjectType<Entity> {
		return BeforeAllocation
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
	const saver = new AllocatorBeforeAllocationSaver()
	await saver.execute()
}

main()
