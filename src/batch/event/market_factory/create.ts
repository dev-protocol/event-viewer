import config from './config.json'
import { ObjectType } from 'typeorm'
import { EventSaver } from 'src/batch/event/common/base'
import { MarketFactoryCreate } from 'src/entities/market-factory-create'

class CreateSaver extends EventSaver {
	// eslint-disable-next-line @typescript-eslint/no-untyped-public-signature
	getSaveData(event: Map<string, any>): any {
		const marketFactoryCreate = new MarketFactoryCreate()
		const values = event.get('returnValues')
		// eslint-disable-next-line @typescript-eslint/camelcase
		marketFactoryCreate.from_address = values._from
		marketFactoryCreate.market = values._market
		return marketFactoryCreate
	}

	getBatchName(): string {
		return 'market factory create'
	}

	getModelObject<Entity>(): ObjectType<Entity> {
		return MarketFactoryCreate
	}

	getContractAddress(): string {
		return config.contractAddress
	}

	getEventName(): string {
		return 'Create'
	}

	getDirPath(): string {
		return __dirname
	}
}

async function main(): Promise<void> {
	const saver = new CreateSaver()
	await saver.execute()
}

main()
