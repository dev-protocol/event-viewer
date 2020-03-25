"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class EventTableAccessor {
    constructor(connection, entityClass) {
        this._connection = connection;
        this._entityClass = entityClass;
    }
    getMaxBlockNumber() {
        return __awaiter(this, void 0, void 0, function* () {
            let { max } = yield this._connection
                .getRepository(this._entityClass)
                .createQueryBuilder()
                .select('MAX(block_number)', 'max')
                .getRawOne();
            if (max === null) {
                max = 0;
            }
            return Number(max);
        });
    }
    hasData(eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            const firstUser = yield this._connection
                .getRepository(this._entityClass)
                .createQueryBuilder('tmp')
                .where('tmp.event_id = :id', { id: eventId })
                .getOne();
            return typeof firstUser !== 'undefined';
        });
    }
}
exports.EventTableAccessor = EventTableAccessor;
//# sourceMappingURL=event.js.map