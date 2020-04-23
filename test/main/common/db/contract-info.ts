import { DbConnection } from '../../../../common/db/common'
import {
	getContractInfo,
	getGroupContractInfo,
	getLegacyGroupContractInfo,
} from '../../../../common/db/contract-info'
import { getDbConnection } from './../../../lib/db'

describe('getContractInfo', () => {
	let con: DbConnection
	beforeAll(async (done) => {
		con = await getDbConnection()
		done()
	})
	afterAll(async (done) => {
		await con.quit()
		done()
	})
	it('If the target record exists, the contract meta-information of the corresponding contract can be retrieved.', async () => {
		const record = await getContractInfo(con.connection, 'Lockup')
		const recordMap = new Map(Object.entries(record))
		expect(recordMap.get('contract_info_address')).toBe(
			'0x3d40fab11ee30e3aa1900ccfafd190f0851a6157'
		)
		expect(recordMap.get('contract_info_abi')).toBe(
			'[{"inputs": [{"internalType": "address","name": "_config","type": "address"}],"payable": false,"stateMutability": "nonpayable","type": "constructor"},{"anonymous": false,"inputs": [{"indexed": false,"internalType": "address","name": "_from","type": "address"},{"indexed": false,"internalType": "address","name": "_property","type": "address"},{"indexed": false,"internalType": "uint256","name": "_value","type": "uint256"}],"name": "Lockedup","type": "event"},{"anonymous": false,"inputs": [{"indexed": false,"internalType": "address","name": "account","type": "address"}],"name": "Paused","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "account","type": "address"}],"name": "PauserAdded","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"internalType": "address","name": "account","type": "address"}],"name": "PauserRemoved","type": "event"},{"anonymous": false,"inputs": [{"indexed": false,"internalType": "address","name": "account","type": "address"}],"name": "Unpaused","type": "event"},{"constant": true,"inputs": [],"name": "_owner","outputs": [{"internalType": "address payable","name": "","type": "address"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [{"internalType": "address","name": "account","type": "address"}],"name": "addPauser","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [],"name": "configAddress","outputs": [{"internalType": "address","name": "","type": "address"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"internalType": "address","name": "account","type": "address"}],"name": "isPauser","outputs": [{"internalType": "bool","name": "","type": "bool"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [],"name": "kill","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": false,"inputs": [],"name": "pause","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [],"name": "paused","outputs": [{"internalType": "bool","name": "","type": "bool"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [],"name": "renouncePauser","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": false,"inputs": [],"name": "unpause","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": false,"inputs": [{"internalType": "address","name": "_from","type": "address"},{"internalType": "address","name": "_property","type": "address"},{"internalType": "uint256","name": "_value","type": "uint256"}],"name": "lockup","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": false,"inputs": [{"internalType": "address","name": "_property","type": "address"}],"name": "cancel","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": false,"inputs": [{"internalType": "address","name": "_property","type": "address"}],"name": "withdraw","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": false,"inputs": [{"internalType": "address","name": "_property","type": "address"},{"internalType": "uint256","name": "_interestResult","type": "uint256"}],"name": "increment","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [{"internalType": "address","name": "_property","type": "address"},{"internalType": "address","name": "_user","type": "address"}],"name": "calculateInterestAmount","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"internalType": "address","name": "_property","type": "address"},{"internalType": "address","name": "_user","type": "address"}],"name": "calculateWithdrawableInterestAmount","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [{"internalType": "address","name": "_property","type": "address"}],"name": "withdrawInterest","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [],"name": "getAllValue","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"internalType": "address","name": "_property","type": "address"}],"name": "getPropertyValue","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"internalType": "address","name": "_property","type": "address"},{"internalType": "address","name": "_sender","type": "address"}],"name": "getValue","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"}]'
		)
	})
	it('If the target record does not exist, the contract meta information of the corresponding contract cannot be retrieved.', async () => {
		const record = await getContractInfo(con.connection, 'dummy')
		expect(record).toBe(undefined)
	})
})

describe('getGroupContractInfo', () => {
	let con: DbConnection
	beforeAll(async (done) => {
		con = await getDbConnection()
		done()
	})
	afterAll(async (done) => {
		await con.quit()
		done()
	})
	it('If the target record exists, the group contract meta-information of the corresponding contract can be retrieved.', async () => {
		const record = await getGroupContractInfo(con.connection, 'Metrics')
		const recordMap = new Map(Object.entries(record))
		expect(recordMap.get('group_contract_info_abi')).toBe(
			'[{"inputs":[{"internalType":"address","name":"_market","type":"address"},{"internalType":"address","name":"_property","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"constant":true,"inputs":[],"name":"market","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"property","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}]'
		)
	})
	it('If the target record does not exist, the group contract meta information of the corresponding contract cannot be retrieved.', async () => {
		const record = await getGroupContractInfo(con.connection, 'dummy')
		expect(record).toBe(undefined)
	})
})

describe('getLegacyGroupContractInfo', () => {
	let con: DbConnection
	beforeAll(async (done) => {
		con = await getDbConnection()
		done()
	})
	afterAll(async (done) => {
		await con.quit()
		done()
	})
	it('If the target record exists, the legacy group contract meta-information of the corresponding contract can be retrieved.', async () => {
		const record = await getLegacyGroupContractInfo(
			con.connection,
			'Market',
			'0x88c7B1f41DdE50efFc25541a2E0769B887eB2ee7'
		)
		const recordMap = new Map(Object.entries(record))
		expect(recordMap.get('legacy_group_contract_info_address')).toBe(
			'0x88c7B1f41DdE50efFc25541a2E0769B887eB2ee7'
		)
		expect(recordMap.get('legacy_group_contract_info_abi')).toBe(
			'[{"inputs":[{"internalType":"address","name":"_config","type":"address"},{"internalType":"address","name":"_behavior","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"constant":false,"inputs":[{"internalType":"address","name":"_prop","type":"address"},{"internalType":"string","name":"_args1","type":"string"},{"internalType":"string","name":"_args2","type":"string"},{"internalType":"string","name":"_args3","type":"string"},{"internalType":"string","name":"_args4","type":"string"},{"internalType":"string","name":"_args5","type":"string"}],"name":"authenticate","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_property","type":"address"},{"internalType":"bytes32","name":"_idHash","type":"bytes32"}],"name":"authenticatedCallback","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"behavior","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_metrics","type":"address"},{"internalType":"uint256","name":"_start","type":"uint256"},{"internalType":"uint256","name":"_end","type":"uint256"}],"name":"calculate","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"configAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"enabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"issuedMetrics","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"schema","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"toEnable","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_property","type":"address"},{"internalType":"bool","name":"_agree","type":"bool"}],"name":"vote","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]'
		)
	})
	it('If the target record does not exist, the legacy group contract meta information of the corresponding contract cannot be retrieved.', async () => {
		const record = await getLegacyGroupContractInfo(
			con.connection,
			'dummy',
			'dummy-addres'
		)
		expect(record).toBe(undefined)
	})
})
