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
const base_1 = require("../common/base");
const allocator_allocation_result_1 = require("../entities/allocator-allocation-result");
class AllocationResultEventSaver extends base_1.EventSaver {
    getModelObject() {
        return allocator_allocation_result_1.AllocatorAllocationResult;
    }
    // eslint-disable-next-line @typescript-eslint/no-untyped-public-signature
    getSaveData(event) {
        const allocationResult = new allocator_allocation_result_1.AllocatorAllocationResult();
        const values = event.get('returnValues');
        allocationResult.metrics = values._metrics;
        allocationResult.arg_value = values._value;
        allocationResult.market = values._market;
        allocationResult.property = values._property;
        allocationResult.lockup_value = values._lockupValue;
        allocationResult.result = values._result;
        return allocationResult;
    }
    getContractName() {
        return 'Allocator';
    }
    getBatchName() {
        return 'allocator-allocation-result';
    }
    getEventName() {
        return 'AllocationResult';
    }
}
const timerTrigger = function (context, myTimer) {
    return __awaiter(this, void 0, void 0, function* () {
        const saver = new AllocationResultEventSaver(context, myTimer);
        yield saver.execute();
    });
};
exports.default = timerTrigger;
//# sourceMappingURL=index.js.map