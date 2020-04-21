import { AzureFunction, Context } from '@azure/functions'
import { Connection } from 'typeorm'
import { TimerBatchBase } from '../common/base'
import { getPropertyByMetrics } from '../common/block-chain/utils'
import { getMaxBlockNumber, getEventRecord } from '../common/db/event'
import { EventSaverLogging } from '../common/notifications'
import { DbConnection, Transaction } from '../common/db/common'
import { PropertyAuthentication } from '../entities/property-authentication'
import { PropertyAuthenticationDeleted } from '../entities/property-authentication-deleted'
import { MetricsFactoryDestroy } from '../entities/metrics-factory-destroy'
/* eslint-disable @typescript-eslint/no-var-requires */
const Web3 = require('web3')

class PropertyAuthenticationDeleter extends TimerBatchBase {
	getBatchName(): string {
		return 'property-authentication'
	}

	async innerExecute(logging: EventSaverLogging): Promise<void> {
		const db = new DbConnection(this.getBatchName())
		await db.connect()

		try {
			await this.movePropertyAuthenticationRecord(db.connection, logging)
		} catch (e) {
			logging.errorlog(e.stack)
			await logging.error(e.message)
			throw e
		} finally {
			await db.quit()
		}
	}

	private async movePropertyAuthenticationRecord(
		con: Connection,
		logging: EventSaverLogging
	): Promise<any[]> {
		const destroyRecords = await this.getEvents(con)
		if (destroyRecords.length === 0) {
			return []
		}

		const web3 = new Web3(
			new Web3.providers.HttpProvider(process.env.WEB3_URL!)
		)
		const relationData = await this.getPropertyInfo(con, web3, destroyRecords)
		const transaction = new Transaction(con)
		try {
			await transaction.start()
			await logging.info(`record count：${relationData.length}`)
			for (const data of relationData) {
				// eslint-disable-next-line no-await-in-loop
				const record = await con
					.getRepository(PropertyAuthentication)
					.createQueryBuilder('tmp')
					.where('tmp.property = :_property AND tmp.metrics = :_metrics', {
						_property: data.property,
						_metrics: data.metrics,
					})
					.getOne()
				if (typeof record === 'undefined') {
					throw new Error(
						// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
						`property_authintication record is not found.  property:${data.property} metrics:${data.metrics}`
					)
				}

				// eslint-disable-next-line no-await-in-loop
				await con
					.createQueryBuilder()
					.delete()
					.from(PropertyAuthentication)
					.where('property = :_property AND metrics = :_metrics', {
						_property: data.property,
						_metrics: data.metrics,
					})
					.execute()
				const saveData = new PropertyAuthenticationDeleted()
				saveData.property = record.property
				saveData.metrics = record.metrics
				saveData.block_number = record.block_number
				saveData.market = record.market
				saveData.authentication_id = record.authentication_id

				// eslint-disable-next-line no-await-in-loop
				await transaction.save(saveData)
			}

			await transaction.commit()
		} catch (e) {
			await transaction.rollback()
			throw e
		} finally {
			await transaction.finish()
		}
	}

	private async getPropertyInfo(
		con: Connection,
		web3: any,
		destroyRecords: MetricsFactoryDestroy[]
	): Promise<any[]> {
		const relationData = []
		for (const record of destroyRecords) {
			// eslint-disable-next-line no-await-in-loop
			const propertyAddress = await getPropertyByMetrics(
				con,
				web3,
				record.metrics
			)
			relationData.push({
				property: propertyAddress,
				metrics: record.metrics,
			})
		}

		return relationData
	}

	private async getEvents(con: Connection): Promise<MetricsFactoryDestroy[]> {
		const blockNumber = await getMaxBlockNumber(
			con,
			PropertyAuthenticationDeleted
		)
		const records = await getEventRecord(
			con,
			MetricsFactoryDestroy,
			blockNumber + 1
		)
		return records
	}
}

const timerTrigger: AzureFunction = async function (
	context: Context,
	myTimer: any
): Promise<void> {
	const dataCreator = new PropertyAuthenticationDeleter(context, myTimer)
	await dataCreator.execute()
}

export default timerTrigger
