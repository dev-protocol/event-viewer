import { getDbConnection } from '../../../lib/db'
import {
	saveGroupContractInfoTestdata,
	clearGroupContractInfoTestdata,
	clearContractInfoTestdata,
} from '../../../lib/test-data'
import {
	getApprovalBlockNumber,
	getPropertyByMetrics,
	getPolicyInstance,
} from '../../../../common/block-chain/utils'

describe('getApprovalBlockNumber', () => {
	class Web3GetBlockNumberMock {
		eth: any
		constructor(_: any) {
			this.eth = {
				// eslint-disable-next-line @typescript-eslint/promise-function-async
				getBlockNumber: function () {
					return new Promise((resolve) => {
						resolve(25000)
					})
				},
			}
		}
	}
	it('Get the block number to be approved.', async () => {
		process.env.APPROVAL = '50'
		const web3 = new Web3GetBlockNumberMock({})
		const result = await getApprovalBlockNumber(web3)
		expect(result).toBe(24950)
	})
})

describe('getPropertyByMetrics', () => {
	class Web3PropertyCallMock {
		eth: any
		constructor(_: any) {
			this.eth = {
				Contract: class Contract {
					_abi: any
					_address: string
					methods: any
					constructor(abi: any, address: string) {
						this._abi = abi
						this._address = address
						this.methods = {}
						this.methods.property = function () {
							return {
								call: async function (): Promise<string> {
									return '0x54E575848E4b62a1a3aaBd09380f73Fc2d6758CA'
								},
							}
						}
					}
				},
			}
		}
	}
	it('can get a property address from a metrics address.', async () => {
		const con = await getDbConnection()
		await saveGroupContractInfoTestdata(con.connection)
		const web3 = new Web3PropertyCallMock('hoge')
		const result = await getPropertyByMetrics(
			con.connection,
			web3,
			'0x0e0eA88eC1bCC0A67B6514887C490a57e6714Fb8'
		)

		expect(result).toBe('0x54E575848E4b62a1a3aaBd09380f73Fc2d6758CA')
		await con.quit()
	})
	it('If the contract information does not exist, an error is returned.', async () => {
		const con = await getDbConnection()
		await clearGroupContractInfoTestdata(con.connection)
		const web3 = new Web3PropertyCallMock('hoge')
		const promise = getPropertyByMetrics(
			con.connection,
			web3,
			'0x0e0eA88eC1bCC0A67B6514887C490a57e6714Fb8'
		)

		await expect(promise).rejects.toThrowError(
			new Error('metrics info is not found')
		)
		await con.quit()
	})
})

describe('getPolicyInstance', () => {
	class Web3Mock {
		eth: any
		constructor(_: any) {
			this.eth = {
				Contract: class Contract {
					_abi: any
					_address: string
					methods: any
					constructor(abi: any, address: string) {
						this._abi = abi
						this._address = address
						this.methods = {}
						this.methods.policy = function () {
							return {
								call: async function (): Promise<string> {
									return '0x54E575848E4b62a1a3aaBd09380f73Fc2d6758CA'
								},
							}
						}
					}
				},
			}
		}
	}
	it('If the information of AddressConfig does not exist, an error occurs.', async () => {
		const con = await getDbConnection()
		await clearContractInfoTestdata(con.connection)
		const web3 = new Web3Mock('hoge')
		const promise = getPolicyInstance(con.connection, web3)
		await expect(promise).rejects.toThrowError(
			new Error('AddressConfig contract info is not found.')
		)
		await con.quit()
	})
})
