import { AzureFunction, Context } from "@azure/functions"
import { ObjectType } from 'typeorm'
import { EventSaver } from "../common/base"
import { MarketFactoryCreate } from '../entities/market-factory-create'
import config from './config.json'
import abi from './abi.json'

class CreateEventSaver extends EventSaver {
	getModelObject<Entity>(): ObjectType<Entity> {
		return MarketFactoryCreate
	}

	getSaveData(event: Map<string, any>): any {
		const metricsFactoryCreate = new MarketFactoryCreate()
		const values = event.get('returnValues')
		metricsFactoryCreate.from_address = values._from
		metricsFactoryCreate.market = values._market
		return metricsFactoryCreate
	}

	getBatchName(): string {
		return "market-factory-create"
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
	const saver = new CreateEventSaver(context, myTimer)
	await saver.execute()
};

export default timerTrigger;
