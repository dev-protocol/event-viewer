/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/camelcase */
import { AzureFunction, Context } from '@azure/functions'
import { Connection } from 'typeorm'
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

const timerTrigger: AzureFunction = async function (
	context: Context,
	myTimer: any
): Promise<void> {
	const batchName = 'property-authentication'
	const logging = new EventSaverLogging(context.log, batchName)
	await logging.start()

	if (myTimer.IsPastDue) {
		await logging.warning('Timer function is running late!')
	}

	const db = new DbConnection(batchName)
	await db.connect()

	try {
		await createPropertyAuthenticationRecord(db.connection)
	} catch (e) {
		context.log.error(e.stack)
		await logging.error(e.message)
		throw e
	} finally {
		await db.quit()
	}

	await logging.finish()
}

async function createPropertyAuthenticationRecord(
	con: Connection
): Promise<void> {
	const blockNumber = await getMaxBlockNumber(con, PropertyAuthentication)
	const records = await getEventRecord(
		con,
		MetricsFactoryCreate,
		blockNumber + 1
	)
	if (records.length === 0) {
		return
	}

	const web3 = new Web3(new Web3.providers.HttpProvider(process.env.WEB3_URL!))
	const transaction = new Transaction(con)
	try {
		await transaction.start()
		for (let record of records) {
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
		}

		await transaction.commit()
	} catch (e) {
		await transaction.rollback()
		throw e
	} finally {
		await transaction.finish()
	}
}

export default timerTrigger
