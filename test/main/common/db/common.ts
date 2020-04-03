import { DbConnection } from '../../../../common/db/common'

describe('DbConnection', () => {
	it('connect.', async () => {
		process.env.DB_HOST = 'localhost'
		process.env.DB_PORT = '5432'
		process.env.DB_USERNAME = 'testuser'
		process.env.DB_PASSWORD = 'testpassword'
		process.env.DB_DATABASE = 'testdb'
		const con = new DbConnection('test-batch-name')
		await con.connect()
		console.log(111)
		expect(con.connection.isConnected).toBe(true)
	})
})
