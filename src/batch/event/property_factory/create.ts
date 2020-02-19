import config from './config.json'
import { ObjectType } from 'typeorm'
import { EventSaver } from 'src/batch/event/common/base'
import { PropertyFactoryCreate } from 'src/entities/property-factory-create'

class CreateSaver extends EventSaver {
	// eslint-disable-next-line @typescript-eslint/no-untyped-public-signature
	getSaveData(event: Map<string, any>): any {
		const propertyFactoryCreate = new PropertyFactoryCreate()
		const values = event.get('returnValues')
		// eslint-disable-next-line @typescript-eslint/camelcase
		propertyFactoryCreate.from_address = values._from
		propertyFactoryCreate.property = values._property
		return propertyFactoryCreate
	}

	getTableName(): string {
		return 'property_factory_create'
	}

	getModelObject<Entity>(): ObjectType<Entity> {
		return PropertyFactoryCreate
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
