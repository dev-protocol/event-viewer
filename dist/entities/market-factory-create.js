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
let MarketFactoryCreate = class MarketFactoryCreate extends typeorm_1.BaseEntity {}
__decorate(
	[typeorm_1.PrimaryColumn(), __metadata('design:type', String)],
	MarketFactoryCreate.prototype,
	'event_id',
	void 0
)
__decorate(
	[typeorm_1.Column(), __metadata('design:type', Number)],
	MarketFactoryCreate.prototype,
	'block_number',
	void 0
)
__decorate(
	[typeorm_1.Column(), __metadata('design:type', Number)],
	MarketFactoryCreate.prototype,
	'log_index',
	void 0
)
__decorate(
	[typeorm_1.Column(), __metadata('design:type', Number)],
	MarketFactoryCreate.prototype,
	'transaction_index',
	void 0
)
__decorate(
	[typeorm_1.Column(), __metadata('design:type', String)],
	MarketFactoryCreate.prototype,
	'from_address',
	void 0
)
__decorate(
	[typeorm_1.Column(), __metadata('design:type', String)],
	MarketFactoryCreate.prototype,
	'market',
	void 0
)
__decorate(
	[typeorm_1.Column(), __metadata('design:type', String)],
	MarketFactoryCreate.prototype,
	'raw_data',
	void 0
)
MarketFactoryCreate = __decorate([typeorm_1.Entity()], MarketFactoryCreate)
exports.MarketFactoryCreate = MarketFactoryCreate
//# sourceMappingURL=market-factory-create.js.map
