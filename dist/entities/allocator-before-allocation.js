'use strict'
var __decorate =
	(this && this.__decorate) ||
	function(decorators, target, key, desc) {
		var c = arguments.length,
			r =
				c < 3
					? target
					: desc === null
					? (desc = Object.getOwnPropertyDescriptor(target, key))
					: desc,
			d
		if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
			r = Reflect.decorate(decorators, target, key, desc)
		else
			for (var i = decorators.length - 1; i >= 0; i--)
				if ((d = decorators[i]))
					r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r
		return c > 3 && r && Object.defineProperty(target, key, r), r
	}
var __metadata =
	(this && this.__metadata) ||
	function(k, v) {
		if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function')
			return Reflect.metadata(k, v)
	}
Object.defineProperty(exports, '__esModule', { value: true })
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable new-cap */
const typeorm_1 = require('typeorm')
let AllocatorBeforeAllocation = class AllocatorBeforeAllocation extends typeorm_1.BaseEntity {}
__decorate(
	[typeorm_1.PrimaryColumn(), __metadata('design:type', String)],
	AllocatorBeforeAllocation.prototype,
	'event_id',
	void 0
)
__decorate(
	[typeorm_1.Column(), __metadata('design:type', Number)],
	AllocatorBeforeAllocation.prototype,
	'block_number',
	void 0
)
__decorate(
	[typeorm_1.Column(), __metadata('design:type', Number)],
	AllocatorBeforeAllocation.prototype,
	'log_index',
	void 0
)
__decorate(
	[typeorm_1.Column(), __metadata('design:type', Number)],
	AllocatorBeforeAllocation.prototype,
	'transaction_index',
	void 0
)
__decorate(
	[typeorm_1.Column(), __metadata('design:type', Number)],
	AllocatorBeforeAllocation.prototype,
	'blocks',
	void 0
)
__decorate(
	[typeorm_1.Column(), __metadata('design:type', Number)],
	AllocatorBeforeAllocation.prototype,
	'mint',
	void 0
)
__decorate(
	[typeorm_1.Column(), __metadata('design:type', Number)],
	AllocatorBeforeAllocation.prototype,
	'token_value',
	void 0
)
__decorate(
	[typeorm_1.Column(), __metadata('design:type', Number)],
	AllocatorBeforeAllocation.prototype,
	'market_value',
	void 0
)
__decorate(
	[typeorm_1.Column(), __metadata('design:type', Number)],
	AllocatorBeforeAllocation.prototype,
	'assets',
	void 0
)
__decorate(
	[typeorm_1.Column(), __metadata('design:type', Number)],
	AllocatorBeforeAllocation.prototype,
	'total_assets',
	void 0
)
__decorate(
	[typeorm_1.Column(), __metadata('design:type', String)],
	AllocatorBeforeAllocation.prototype,
	'raw_data',
	void 0
)
AllocatorBeforeAllocation = __decorate(
	[typeorm_1.Entity()],
	AllocatorBeforeAllocation
)
exports.AllocatorBeforeAllocation = AllocatorBeforeAllocation
//# sourceMappingURL=allocator-before-allocation.js.map
