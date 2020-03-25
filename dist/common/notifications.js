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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_webhook_ts_1 = __importDefault(require("discord-webhook-ts"));
class DiscordNotification {
    sendInfo(title, titleDescription, field, fieldDesctiption) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = this._createRequestBody(title, titleDescription, field, fieldDesctiption);
            yield this._send(body, process.env.DISCORD_WEBHOOK_URL_INFO);
        });
    }
    sendWarning(title, titleDescription, field, fieldDesctiption) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = this._createRequestBody(title, titleDescription, field, fieldDesctiption);
            yield this._send(body, process.env.DISCORD_WEBHOOK_URL_WARNING);
        });
    }
    sendError(title, titleDescription, field, fieldDesctiption) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = this._createRequestBody(title, titleDescription, field, fieldDesctiption);
            yield this._send(body, process.env.DISCORD_WEBHOOK_URL_ERROR);
        });
    }
    _send(requestBody, url) {
        return __awaiter(this, void 0, void 0, function* () {
            const discordClient = new discord_webhook_ts_1.default(url);
            yield discordClient.execute(requestBody);
        });
    }
    _createRequestBody(title, titleDescription, field, fieldDesctiption) {
        const requestBody = {
            embeds: [
                {
                    title: title,
                    description: titleDescription
                },
                {
                    fields: [
                        {
                            name: field,
                            value: fieldDesctiption
                        }
                    ]
                }
            ]
        };
        return requestBody;
    }
}
class EventSaverLogging {
    constructor(logger, batchName) {
        this._logger = logger;
        this._batchName = batchName;
        this._discord = new DiscordNotification();
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this._logger.info(this._batchName + ' started');
            yield this._discord.sendInfo('EventSaver', this._batchName, 'message', 'start');
        });
    }
    finish() {
        return __awaiter(this, void 0, void 0, function* () {
            this._logger.info(this._batchName + ' finished');
            yield this._discord.sendInfo('EventSaver', this._batchName, 'message', 'finish');
        });
    }
    warning(message) {
        return __awaiter(this, void 0, void 0, function* () {
            this._logger.warn(this._batchName + ':' + message);
            yield this._discord.sendWarning('EventSaver', this._batchName, 'message', message);
        });
    }
    info(message) {
        return __awaiter(this, void 0, void 0, function* () {
            this._logger.info(this._batchName + ':' + message);
            yield this._discord.sendInfo('EventSaver', this._batchName, 'message', message);
        });
    }
    error(message) {
        return __awaiter(this, void 0, void 0, function* () {
            this._logger.error(this._batchName + ':' + message);
            yield this._discord.sendError('EventSaver', this._batchName, 'message', message);
        });
    }
}
exports.EventSaverLogging = EventSaverLogging;
//# sourceMappingURL=notifications.js.map