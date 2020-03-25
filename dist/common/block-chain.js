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
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Web3 = require('web3')
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function getApprovalBlockNumber() {
	return __awaiter(this, void 0, void 0, function*() {
		const web3 = new Web3(new Web3.providers.HttpProvider(process.env.WEB3_URL))
		const currentBlockNumber = yield web3.eth.getBlockNumber()
		return currentBlockNumber - Number(process.env.APPROVAL)
	})
}
exports.getApprovalBlockNumber = getApprovalBlockNumber
class Event {
	constructor() {
		this._web3 = new Web3(new Web3.providers.HttpProvider(process.env.WEB3_URL))
	}
	// eslint-disable-next-line @typescript-eslint/no-untyped-public-signature
	generateContract(abi, contractAddress) {
		return __awaiter(this, void 0, void 0, function*() {
			this._contract = yield new this._web3.eth.Contract(abi, contractAddress)
		})
	}
	getEvent(eventName, firstBlock, lastBlock) {
		return __awaiter(this, void 0, void 0, function*() {
			const events = yield this._contract.getPastEvents(eventName, {
				fromBlock: firstBlock,
				toBlock: lastBlock
			})
			return events
		})
	}
}
exports.Event = Event
//# sourceMappingURL=block-chain.js.map
