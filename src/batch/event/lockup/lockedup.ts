import config from './config.json'
import { ObjectType } from 'typeorm'
import { EventSaver } from 'src/batch/event/common/base'
import { LockupLockedup } from 'src/entities/lockup-lockedup'

class LockedupSaver extends EventSaver {
	// eslint-disable-next-line @typescript-eslint/no-untyped-public-signature
	getSaveData(event: Map<string, any>): any {
		const lockupLockedup = new LockupLockedup()
		const values = event.get('returnValues')
		// eslint-disable-next-line @typescript-eslint/camelcase
		lockupLockedup.from_address = values._from
		lockupLockedup.property = values._property
		// eslint-disable-next-line @typescript-eslint/camelcase
		lockupLockedup.token_value = values._value
		return lockupLockedup
	}

	getBatchName(): string {
		return 'lockup lockeup'
	}

	getModelObject<Entity>(): ObjectType<Entity> {
		return LockupLockedup
	}

	getContractAddress(): string {
		return config.contractAddress
	}

	getEventName(): string {
		return 'Lockedup'
	}

	getDirPath(): string {
		return __dirname
	}
}

async function main(): Promise<void> {
	const saver = new LockedupSaver()
	await saver.execute()
}

main()
