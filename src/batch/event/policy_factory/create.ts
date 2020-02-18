import config from './config.json'
import { ObjectType } from 'typeorm'
import { EventSaver } from 'src/batch/event/common/base'
import { PolicyFactoryCreate } from 'src/entities/policy-factory-create'

class CreateSaver extends EventSaver {
	// eslint-disable-next-line @typescript-eslint/no-untyped-public-signature
	getSaveData(event: Map<string, any>): any {
		const policyFactoryCreate = new PolicyFactoryCreate()
		const values = event.get('returnValues')
		// eslint-disable-next-line @typescript-eslint/camelcase
		policyFactoryCreate.from_address = values._from
		// eslint-disable-next-line @typescript-eslint/camelcase
		policyFactoryCreate.policy_address = values._policy
		// eslint-disable-next-line @typescript-eslint/camelcase
		policyFactoryCreate.inner_policy = values._innerPolicy
		return policyFactoryCreate
	}

	getBatchName(): string {
		return 'policy factory create'
	}

	getModelObject<Entity>(): ObjectType<Entity> {
		return PolicyFactoryCreate
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
