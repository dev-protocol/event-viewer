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
const typeorm_1 = require("typeorm");
class DbConnection {
    constructor(batchName) {
        this._batchName = batchName;
    }
    get connection() {
        return this._connection;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            const config = this._getConfig();
            this._connection = yield typeorm_1.createConnection(config);
            typeorm_1.BaseEntity.useConnection(this._connection);
        });
    }
    quit() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._connection.close();
        });
    }
    _getConfig() {
        return {
            name: this._batchName,
            type: 'postgres',
            synchronize: false,
            logging: false,
            entities: ['dist/entities/*.js'],
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        };
    }
}
exports.DbConnection = DbConnection;
class Transaction {
    constructor(connection) {
        this._runner = connection.createQueryRunner();
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._runner.connect();
            yield this._runner.startTransaction();
        });
    }
    save(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._runner.manager.save(entity);
        });
    }
    commit() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._runner.commitTransaction();
        });
    }
    rollback() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._runner.rollbackTransaction();
        });
    }
    finish() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._runner.release();
        });
    }
}
exports.Transaction = Transaction;
//# sourceMappingURL=common.js.map