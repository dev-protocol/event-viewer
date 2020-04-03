import { DbConnection } from '../../../../common/db/common'

describe('DbConnection', () => {
	it('connect.', async () => {
		const con = new DbConnection('test-batch-name')
		await con.connect()
		expect(con.connection.isConnected).toBe(true)
	})
})
