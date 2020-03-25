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
const allocator_before_allocation_1 = require('../entities/allocator-before-allocation')
class BeforeAllocationEventSaver extends base_1.EventSaver {
	getModelObject() {
		return allocator_before_allocation_1.AllocatorBeforeAllocation
	}
	// eslint-disable-next-line @typescript-eslint/no-untyped-public-signature
	getSaveData(event) {
		const beforeAllocation = new allocator_before_allocation_1.AllocatorBeforeAllocation()
		const values = event.get('returnValues')
		beforeAllocation.blocks = values._blocks
		beforeAllocation.mint = values._mint
		beforeAllocation.token_value = values._value
		beforeAllocation.market_value = values._marketValue
		beforeAllocation.assets = values._assets
		beforeAllocation.total_assets = values._totalAssets
		return beforeAllocation
	}
	getContractName() {
		return 'Allocator'
	}
	getBatchName() {
		return 'allocator-before-allocation'
	}
	getEventName() {
		return 'BeforeAllocation'
	}
}
const timerTrigger = function(context, myTimer) {
	return __awaiter(this, void 0, void 0, function*() {
		const saver = new BeforeAllocationEventSaver(context, myTimer)
		yield saver.execute()
	})
}
exports.default = timerTrigger
//# sourceMappingURL=index.js.map
