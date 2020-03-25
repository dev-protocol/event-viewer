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
const contract_address_1 = require('../../entities/contract-address')
class ContractAddressAccessor {
	constructor(connection) {
		this._connection = connection
	}
	getContractAddress(batchName) {
		return __awaiter(this, void 0, void 0, function*() {
			const record = yield this._connection
				.getRepository(contract_address_1.ContractAddress)
				.createQueryBuilder('contract_address')
				.where('contract_address.batch_name = :name', { name: batchName })
				.getRawOne()
			return record.contract_address_contract_address
		})
	}
}
exports.ContractAddressAccessor = ContractAddressAccessor
//# sourceMappingURL=contract-address.js.map
