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
const lockup_lockedup_1 = require('../entities/lockup-lockedup')
class LockupdEventSaver extends base_1.EventSaver {
	getModelObject() {
		return lockup_lockedup_1.LockupLockedup
	}
	// eslint-disable-next-line @typescript-eslint/no-untyped-public-signature
	getSaveData(event) {
		const lockupLockedup = new lockup_lockedup_1.LockupLockedup()
		const values = event.get('returnValues')
		lockupLockedup.from_address = values._from
		lockupLockedup.property = values._property
		lockupLockedup.token_value = values._value
		return lockupLockedup
	}
	getContractName() {
		return 'Lockup'
	}
	getBatchName() {
		return 'lockup-lockedup'
	}
	getEventName() {
		return 'Lockedup'
	}
}
const timerTrigger = function(context, myTimer) {
	return __awaiter(this, void 0, void 0, function*() {
		const saver = new LockupdEventSaver(context, myTimer)
		yield saver.execute()
	})
}
exports.default = timerTrigger
//# sourceMappingURL=index.js.map
