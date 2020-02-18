/* eslint-disable @typescript-eslint/camelcase */
import config from './config.json'
import { ObjectType } from 'typeorm'
import { EventSaver } from 'src/batch/event/common/base'
import { PropertyFactoryCreate } from 'src/entities/PropertyFactoryCreate'

class PropertyFactoryCreateSaver extends EventSaver {
	// eslint-disable-next-line @typescript-eslint/no-untyped-public-signature
	getSaveData(event: Map<string, any>): any {
		const propertyFactoryCreate = new PropertyFactoryCreate()
		const createEvent = new Map(Object.entries(event))
		propertyFactoryCreate.event_id = createEvent.get('id')
		propertyFactoryCreate.block_number = createEvent.get('blockNumber')
		propertyFactoryCreate.log_index = createEvent.get('logIndex')
		propertyFactoryCreate.transaction_index = createEvent.get(
			'transactionIndex'
		)
		propertyFactoryCreate.from_address = createEvent.get('returnValues')._from
		propertyFactoryCreate.policy = createEvent.get('returnValues')._policy
		propertyFactoryCreate.inner_policy = createEvent.get(
			'returnValues'
		)._innerPolicy
		propertyFactoryCreate.raw = JSON.stringify(event)
		return propertyFactoryCreate
	}

	getBatchName(): string {
		return PropertyFactoryCreateSaver.name
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
	const saver = new PropertyFactoryCreateSaver()
	await saver.execute()
}

main()
