import { AzureFunction, Context } from "@azure/functions"
import { EventSaver } from "../common/base"
import config from './config.json'
import abi from './abi.json'

class CreateSaver extends EventSaver {
	getBatchName(): string {
		return "policy factory create"
	}


	getContractAddress(): string {
		return config.contractAddress
	}

	getPartitionKey(): string {
		return '/returnValues/_from'
	}

	getAbi(): any {
		return abi
	}

	getEventName(): string {
		return 'Create'
	}
}


const timerTrigger: AzureFunction = async function (context: Context, myTimer: any): Promise<void> {
	const saver = new CreateSaver(context, myTimer, 'PolicyFactoryCreate')
	await saver.execute()
};

export default timerTrigger;
