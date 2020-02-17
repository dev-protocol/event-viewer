import DiscordWebhook, { Webhook } from 'discord-webhook-ts'

export class DiscordNotification {
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
