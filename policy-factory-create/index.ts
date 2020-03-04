import { AzureFunction, Context } from "@azure/functions"
import { ObjectType } from 'typeorm'
import { EventSaver } from "../common/base"
import { PolicyFactoryCreate } from '../entity/policy-factory-create'
import config from './config.json'
import abi from './abi.json'

class CreateSaver extends EventSaver {
	getModelObject<Entity>(): ObjectType<Entity> {
		return PolicyFactoryCreate
	}

	getSaveData(event: Map<string, any>): any {
		const policyFactoryCreate = new PolicyFactoryCreate()
		const values = event.get('returnValues')
		policyFactoryCreate.from_address = values._from
		policyFactoryCreate.policy_address = values._policy
		policyFactoryCreate.inner_policy = values._innerPolicy
		return policyFactoryCreate
	}

	getBatchName(): string {
		return "policy factory create"
	}


	getContractAddress(): string {
		return config.contractAddress
	}

	getAbi(): any {
		return abi
	}

	getEventName(): string {
		return 'Create'
	}
}


const timerTrigger: AzureFunction = async function (context: Context, myTimer: any): Promise<void> {
	const saver = new CreateSaver(context, myTimer)
	await saver.execute()
};

export default timerTrigger;
