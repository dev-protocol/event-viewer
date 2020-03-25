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
const base_1 = require('../common/base')
const market_factory_create_1 = require('../entities/market-factory-create')
class CreateEventSaver extends base_1.EventSaver {
	getModelObject() {
		return market_factory_create_1.MarketFactoryCreate
	}
	// eslint-disable-next-line @typescript-eslint/no-untyped-public-signature
	getSaveData(event) {
		const metricsFactoryCreate = new market_factory_create_1.MarketFactoryCreate()
		const values = event.get('returnValues')
		// eslint-disable-next-line @typescript-eslint/camelcase
		metricsFactoryCreate.from_address = values._from
		metricsFactoryCreate.market = values._market
		return metricsFactoryCreate
	}
	getContractName() {
		return 'MarketFactory'
	}
	getBatchName() {
		return 'market-factory-create'
	}
	getEventName() {
		return 'Create'
	}
}
const timerTrigger = function(context, myTimer) {
	return __awaiter(this, void 0, void 0, function*() {
		const saver = new CreateEventSaver(context, myTimer)
		yield saver.execute()
	})
}
exports.default = timerTrigger
//# sourceMappingURL=index.js.map
