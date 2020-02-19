import config from './config.json'
import { ObjectType } from 'typeorm'
import { EventSaver } from 'src/batch/event/common/base'
import { MetricsFactoryCreate } from 'src/entities/metrics-factory-create'

class CreateSaver extends EventSaver {
	// eslint-disable-next-line @typescript-eslint/no-untyped-public-signature
	getSaveData(event: Map<string, any>): any {
		const metricsFactoryCreate = new MetricsFactoryCreate()
		const values = event.get('returnValues')
		// eslint-disable-next-line @typescript-eslint/camelcase
		metricsFactoryCreate.from_address = values._from
		metricsFactoryCreate.metrics = values._metrics
		return metricsFactoryCreate
	}

	getTableName(): string {
		return 'metrics_factory_create'
	}

	getModelObject<Entity>(): ObjectType<Entity> {
		return MetricsFactoryCreate
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
