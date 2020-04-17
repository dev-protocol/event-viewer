import { DbConnection } from '../../../../common/db/common'
import { EventTableAccessor } from '../../../../common/db/event'
import { LockupLockedup } from '../../../../entities/lockup-lockedup'
import { getDbConnection } from './../../../lib/db'
import {
	saveLockupLockupedTestdata,
	clearLockupLockupedTestdata,
} from './../../../lib/test-data'

describe('EventTableAccessor', () => {
	let con: DbConnection
	beforeAll(async (done) => {
		con = await getDbConnection()
		done()
	})
	afterAll(async (done) => {
		await con.quit()
		done()
	})
	it('can get the maximum block_number that exists in the record..', async () => {
		await clearLockupLockupedTestdata(con.connection)
		const event = new EventTableAccessor(con.connection, LockupLockedup)
		let nomber = await event.getMaxBlockNumber()
		expect(nomber).toBe(0)
		await saveLockupLockupedTestdata(con.connection, true)
		nomber = await event.getMaxBlockNumber()
		expect(nomber).toBe(32000)
	})
	it('Based on the event ID, it is possible to check the existence of data in the record.', async () => {
		await saveLockupLockupedTestdata(con.connection, true)
		const event = new EventTableAccessor(con.connection, LockupLockedup)
		let hasData = await event.hasData('dummy-event-id1')
		expect(hasData).toBe(true)
		hasData = await event.hasData('dummy')
		expect(hasData).toBe(false)
	})
})
