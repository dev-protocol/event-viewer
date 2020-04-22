/* eslint-disable no-await-in-loop */
import { AzureFunction, Context } from '@azure/functions'
import { Connection } from 'typeorm'
import { TimerBatchBase } from '../common/base'
import { getTargetRecordsSeparatedByBlockNumber } from '../common/utils'
import { EventSaverLogging } from '../common/notifications'
import { DbConnection, Transaction } from '../common/db/common'
import { getMaxBlockNumber, getEventRecord } from '../common/db/event'
import {
	getPropertyByMetrics,
	getAuthenticationIdByMetrics,
} from '../common/block-chain/utils'
import { PropertyAuthentication } from '../entities/property-authentication'
import { MetricsFactoryCreate } from '../entities/metrics-factory-create'
/* eslint-disable @typescript-eslint/no-var-requires */
const Web3 = require('web3')

class PropertyAuthenticationCreator extends TimerBatchBase {
	getBatchName(): string {
		return 'property-authentication'
	}

	async innerExecute(logging: EventSaverLogging): Promise<void> {
		const db = new DbConnection(this.getBatchName())
		await db.connect()

		try {
			await this.createPropertyAuthenticationRecord(db.connection, logging)
		} catch (e) {
			logging.errorlog(e.stack)
			await logging.error(e.message)
			throw e
		} finally {
			await db.quit()
		}
	}

	private async createPropertyAuthenticationRecord(
		con: Connection,
		logging: EventSaverLogging
	): Promise<void> {
		const blockNumber = await getMaxBlockNumber(con, PropertyAuthentication)
		const records = await getEventRecord(
			con,
			MetricsFactoryCreate,
			blockNumber + 1
		)
		if (records.length === 0) {
			logging.infolog('no target record')
			return
		}

		const targetRecords = getTargetRecordsSeparatedByBlockNumber(records, 100)

		const web3 = new Web3(
			new Web3.providers.HttpProvider(process.env.WEB3_URL!)
		)
		const transaction = new Transaction(con)
		try {
			await transaction.start()
			logging.infolog(`record count：${targetRecords.length}`)
			let count = 0
			for (let record of targetRecords) {
				const insertRecord = new PropertyAuthentication()
				insertRecord.block_number = record.block_number
				insertRecord.property = await getPropertyByMetrics(
					con,
					web3,
					record.metrics
				)
				insertRecord.market = record.from_address
				insertRecord.metrics = record.metrics
				insertRecord.authentication_id = await getAuthenticationIdByMetrics(
					con,
					web3,
					record.from_address,
					record.metrics
				)
				await transaction.save(insertRecord)
				count++
				if (count % 10 === 0) {
					logging.infolog(`records were inserted：${count}`)
				}
			}

			await transaction.commit()
			logging.infolog(`all records were inserted：${targetRecords.length}`)
		} catch (e) {
			await transaction.rollback()
			throw e
		} finally {
			await transaction.finish()
		}
	}
}

const timerTrigger: AzureFunction = async function (
	context: Context,
	myTimer: any
): Promise<void> {
	const dataCreator = new PropertyAuthenticationCreator(context, myTimer)
	await dataCreator.execute()
}

export default timerTrigger
