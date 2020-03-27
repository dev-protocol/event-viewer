/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-empty-function */
import context from 'azure-function-context-mock'
context.log.erro = function(..._: any[]): void {}
context.log.warn = function(..._: any[]): void {}
context.log.info = function(..._: any[]): void {}
context.log.verbose = function(..._: any[]): void {}

jest.mock('discord-webhook-ts')

import DiscordWebhook from 'discord-webhook-ts'

// Tslint:disable-next-line:no-any
const discordClient = new DiscordWebhook('')
;(discordClient.execute as any).mockResolvedValue()

import { EventSaverLogging } from '../../common/notifications'

describe('EventSaverLogging .start .finish', () => {
	it('No error occurs when running start or finish.', async () => {
		const res = new EventSaverLogging(context.log, 'TestBatchName')
		await res.start()
		await res.finish()
	})
})
