import { LockupLockedup } from '../../../../entities/lockup-lockedup'
import { getDbConnection } from './../../../lib/db'
import { saveLockupLockupedTestdata } from './../../../lib/test-data'

describe('DbConnection', () => {
	it('can connect to db.', async () => {
		const con = await getDbConnection()
		expect(con.connection.isConnected).toBe(true)
		await con.quit()
	})
})

describe('Transaction', () => {
	it('can save data when you commit.', async () => {
		const con = await getDbConnection()
		await saveLockupLockupedTestdata(con.connection, true)
		const recordCount = await con.connection
			.getRepository(LockupLockedup)
			.count()
		await con.quit()
		expect(recordCount).toBe(3)
	})
	it('cannot save data when you rollback.', async () => {
		const con = await getDbConnection()
		await saveLockupLockupedTestdata(con.connection, false)
		const recordCount = await con.connection
			.getRepository(LockupLockedup)
			.count()
		await con.quit()
		expect(recordCount).toBe(0)
	})
})
