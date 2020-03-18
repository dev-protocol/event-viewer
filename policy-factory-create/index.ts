/* eslint-disable @typescript-eslint/camelcase */
import { AzureFunction, Context } from '@azure/functions'
import { ObjectType } from 'typeorm'
import { EventSaver } from '../common/base'
import { PolicyFactoryCreate } from '../entities/policy-factory-create'
import abi from './abi.json'

class CreateEventSaver extends EventSaver {
	getModelObject<Entity>(): ObjectType<Entity> {
		return PolicyFactoryCreate
	}

	// eslint-disable-next-line @typescript-eslint/no-untyped-public-signature
	getSaveData(event: Map<string, any>): any {
		const policyFactoryCreate = new PolicyFactoryCreate()
		const values = event.get('returnValues')
		policyFactoryCreate.from_address = values._from
		policyFactoryCreate.policy_address = values._policy
		policyFactoryCreate.inner_policy = values._innerPolicy
		return policyFactoryCreate
	}

	getBatchName(): string {
		return 'policy-factory-create'
	}

	// eslint-disable-next-line @typescript-eslint/no-untyped-public-signature
	getAbi(): any {
		return abi
	}

	getEventName(): string {
		return 'Create'
	}
}

const timerTrigger: AzureFunction = async function(
	context: Context,
	myTimer: any
): Promise<void> {
	const saver = new CreateEventSaver(context, myTimer)
	await saver.execute()
}

export default timerTrigger
