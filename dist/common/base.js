'use strict'
var __awaiter =
	(this && this.__awaiter) ||
	function(thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P
				? value
				: new P(function(resolve) {
						resolve(value)
				  })
		}
		return new (P || (P = Promise))(function(resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value))
				} catch (e) {
					reject(e)
				}
			}
			function rejected(value) {
				try {
					step(generator['throw'](value))
				} catch (e) {
					reject(e)
				}
			}
			function step(result) {
				result.done
					? resolve(result.value)
					: adopt(result.value).then(fulfilled, rejected)
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next())
		})
	}
Object.defineProperty(exports, '__esModule', { value: true })
const notifications_1 = require('./notifications')
const common_1 = require('./db/common')
const event_1 = require('./db/event')
const contract_info_1 = require('./db/contract-info')
const block_chain_1 = require('./block-chain')
class EventSaver {
	// eslint-disable-next-line @typescript-eslint/no-untyped-public-signature
	constructor(context, myTimer) {
		this._context = context
		this._myTimer = myTimer
		this._db = new common_1.DbConnection(this.getBatchName())
	}
	execute() {
		return __awaiter(this, void 0, void 0, function*() {
			const logging = new notifications_1.EventSaverLogging(
				this._context.log,
				this.getBatchName()
			)
			try {
				yield logging.start()
				if (this._myTimer.IsPastDue) {
					yield logging.warning('Timer function is running late!')
				}
				yield this._db.connect()
				const events = yield this._getEvents()
				if (events.length !== 0) {
					yield this._saveEvents(events)
					yield logging.info('save ' + String(events.length) + ' data')
				}
			} catch (err) {
				yield this._notificationError(err, logging)
				throw err
			} finally {
				try {
					yield this._db.quit()
				} catch (quitErr) {
					this._context.log.error(quitErr)
				}
			}
			yield logging.finish()
		})
	}
	_notificationError(err, logging) {
		return __awaiter(this, void 0, void 0, function*() {
			try {
				let desctiption = err.stack
				if (typeof desctiption === 'undefined') {
					desctiption = err.message
				}
				yield logging.error(desctiption)
			} catch (nexteErr) {
				this._context.log.error(err)
				this._context.log.error(nexteErr)
			}
		})
	}
	_saveEvents(events) {
		return __awaiter(this, void 0, void 0, function*() {
			const eventTable = new event_1.EventTableAccessor(
				this._db.connection,
				this.getModelObject()
			)
			const transaction = new common_1.Transaction(this._db.connection)
			try {
				yield transaction.start()
				for (let event of events) {
					const eventMap = new Map(Object.entries(event))
					// eslint-disable-next-line no-await-in-loop
					const hasData = yield eventTable.hasData(eventMap.get('id'))
					if (hasData) {
						throw Error('Data already exists.')
					}
					const saveData = this.getSaveData(eventMap)
					saveData.event_id = eventMap.get('id')
					saveData.block_number = eventMap.get('blockNumber')
					saveData.log_index = eventMap.get('logIndex')
					saveData.transaction_index = eventMap.get('transactionIndex')
					saveData.raw_data = JSON.stringify(event)
					// eslint-disable-next-line no-await-in-loop
					yield transaction.save(saveData)
				}
				yield transaction.commit()
			} catch (err) {
				yield transaction.rollback()
				throw err
			} finally {
				yield transaction.finish()
			}
		})
	}
	_getEvents() {
		return __awaiter(this, void 0, void 0, function*() {
			const eventTable = new event_1.EventTableAccessor(
				this._db.connection,
				this.getModelObject()
			)
			const maxBlockNumber = yield eventTable.getMaxBlockNumber()
			const contractInfo = yield this._getContractInfo()
			const approvalBlockNumber = yield block_chain_1.getApprovalBlockNumber()
			const event = new block_chain_1.Event()
			this._context.log.info(
				'target contract address:' + contractInfo.get('contract_info_address')
			)
			yield event.generateContract(
				JSON.parse(contractInfo.get('contract_info_abi')),
				contractInfo.get('contract_info_address')
			)
			const events = yield event.getEvent(
				this.getEventName(),
				Number(maxBlockNumber) + 1,
				approvalBlockNumber
			)
			return events
		})
	}
	_getContractInfo() {
		return __awaiter(this, void 0, void 0, function*() {
			const contractInfoAccessor = new contract_info_1.ContractInfoAccessor(
				this._db.connection
			)
			const info = yield contractInfoAccessor.getContractInfo(
				this.getContractName()
			)
			return new Map(Object.entries(info))
		})
	}
}
exports.EventSaver = EventSaver
//# sourceMappingURL=base.js.map
