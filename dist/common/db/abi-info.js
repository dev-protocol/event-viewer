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
const abi_info_1 = require('../../entities/abi-info')
class AbiInfoAccessor {
	constructor(connection) {
		this._connection = connection
	}
	getAbi(batchName) {
		return __awaiter(this, void 0, void 0, function*() {
			const record = yield this._connection
				.getRepository(abi_info_1.AbiInfo)
				.createQueryBuilder('abi_info')
				.where('abi_info.batch_name = :name', { name: batchName })
				.getRawOne()
			return record.abi_info_abi
		})
	}
}
exports.AbiInfoAccessor = AbiInfoAccessor
//# sourceMappingURL=abi-info.js.map
