import { Logger } from '@azure/functions'
import DiscordWebhook, { Webhook } from 'discord-webhook-ts'

class DiscordNotification {
	public async sendInfo(
		title: string,
		titleDescription: string,
		field: string,
		fieldDesctiption: string
	): Promise<void> {
		const body = this._createRequestBody(
			title,
			titleDescription,
			field,
			fieldDesctiption
		)
		await this._send(body, process.env.DISCORD_WEBHOOK_URL_INFO!)
	}

	public async sendWarning(
		title: string,
		titleDescription: string,
		field: string,
		fieldDesctiption: string
	): Promise<void> {
		const body = this._createRequestBody(
			title,
			titleDescription,
			field,
			fieldDesctiption
		)
		await this._send(body, process.env.DISCORD_WEBHOOK_URL_WARNING!)
	}

	public async sendError(
		title: string,
		titleDescription: string,
		field: string,
		fieldDesctiption: string
	): Promise<void> {
		const body = this._createRequestBody(
			title,
			titleDescription,
			field,
			fieldDesctiption
		)
		await this._send(body, process.env.DISCORD_WEBHOOK_URL_ERROR!)
	}

	private async _send(
		requestBody: Webhook.input.POST,
		url: string
	): Promise<void> {
		const discordClient = new DiscordWebhook(url)
		await discordClient.execute(requestBody)
	}

	private _createRequestBody(
		title: string,
		titleDescription: string,
		field: string,
		fieldDesctiption: string
	): Webhook.input.POST {
		const requestBody: Webhook.input.POST = {
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
		}
		return requestBody
	}
}

export class EventSaverLogging {
	private readonly _logger: Logger
	private readonly _batchName: string
	private readonly _discord: DiscordNotification
	constructor(logger: Logger, batchName: string) {
		this._logger = logger
		this._batchName = batchName
		this._discord = new DiscordNotification()
	}

	public async start(): Promise<void> {
		this._logger.info(this._batchName + ' started')
		await this._discord.sendInfo(
			'EventSaver',
			this._batchName,
			'message',
			'start'
		)
	}

	public async finish(): Promise<void> {
		this._logger.info(this._batchName + ' finished')
		await this._discord.sendInfo(
			'EventSaver',
			this._batchName,
			'message',
			'finish'
		)
	}

	public async warning(message: string): Promise<void> {
		this._logger.warn(this._batchName + ':' + message)
		await this._discord.sendWarning(
			'EventSaver',
			this._batchName,
			'message',
			message
		)
	}

	public async info(message: string): Promise<void> {
		this._logger.info(this._batchName + ':' + message)
		await this._discord.sendInfo(
			'EventSaver',
			this._batchName,
			'message',
			message
		)
	}

	public async error(message: string): Promise<void> {
		this._logger.error(this._batchName + ':' + message)
		await this._discord.sendError(
			'EventSaver',
			this._batchName,
			'message',
			message
		)
	}
}
