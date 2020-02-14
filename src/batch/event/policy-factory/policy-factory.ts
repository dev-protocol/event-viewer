/* eslint-disable @typescript-eslint/camelcase */
import config from './config.json'
import { PropertyFactoryCreate } from 'src/entities/PropertyFactoryCreate'
import { EventSaver } from 'src/batch/event/common/base'
import { ObjectType } from 'typeorm'

class PropertyFactoryCreateSaver extends EventSaver {
	// eslint-disable-next-line @typescript-eslint/no-untyped-public-signature
	getSaveData(event: any): any {
		const propertyFactoryCreate = new PropertyFactoryCreate()
		propertyFactoryCreate.event_id = event.id
		propertyFactoryCreate.block_number = event.blockNumber
		propertyFactoryCreate.log_index = event.logIndex
		propertyFactoryCreate.transaction_index = event.transactionIndex
		propertyFactoryCreate.from_address = event.returnValues._from
		propertyFactoryCreate.policy = event.returnValues._policy
		propertyFactoryCreate.inner_policy = event.returnValues._innerPolicy
		propertyFactoryCreate.raw = event
		return propertyFactoryCreate
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

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function main() {
	const saver = new PropertyFactoryCreateSaver()
	await saver.execute()
}

main()


//TODO
// DB接奥情報をconfigで持ちたい
// testモードを作成
