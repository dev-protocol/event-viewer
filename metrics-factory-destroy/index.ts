import { AzureFunction, Context } from '@azure/functions'
import { ObjectType } from 'typeorm'
import { EventSaver } from '../common/base'
import { MetricsFactoryDestroy } from '../entities/metrics-factory-destroy'
import abi from './abi.json'

class DestroyEventSaver extends EventSaver {
	getModelObject<Entity>(): ObjectType<Entity> {
		return MetricsFactoryDestroy
	}

	// eslint-disable-next-line @typescript-eslint/no-untyped-public-signature
	getSaveData(event: Map<string, any>): any {
		const metricsFactoryDestroy = new MetricsFactoryDestroy()
		const values = event.get('returnValues')
		// eslint-disable-next-line @typescript-eslint/camelcase
		metricsFactoryDestroy.from_address = values._from
		metricsFactoryDestroy.metrics = values._metrics
		return metricsFactoryDestroy
	}

	getBatchName(): string {
		return 'metrics-factory-destroy'
	}

	// eslint-disable-next-line @typescript-eslint/no-untyped-public-signature
	getAbi(): any {
		return abi
	}

	getEventName(): string {
		return 'Destroy'
	}
}

const timerTrigger: AzureFunction = async function(
	context: Context,
	myTimer: any
): Promise<void> {
	const saver = new DestroyEventSaver(context, myTimer)
	await saver.execute()
}

export default timerTrigger
