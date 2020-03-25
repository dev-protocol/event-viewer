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
const contract_info_1 = require("../../entities/contract-info");
class ContractInfoAccessor {
    constructor(connection) {
        this._connection = connection;
    }
    getContractInfo(batchName) {
        return __awaiter(this, void 0, void 0, function* () {
            const record = yield this._connection
                .getRepository(contract_info_1.ContractInfo)
                .createQueryBuilder('contract_info')
                .where('contract_info.name = :name', { name: batchName })
                .getRawOne();
            return record;
        });
    }
}
exports.ContractInfoAccessor = ContractInfoAccessor;
//# sourceMappingURL=contract-info.js.map