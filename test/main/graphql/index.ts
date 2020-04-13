import httpTrigger from '../../../graphql/index'
import { getContextMock } from '../../lib/context'
import { getHttpRequestMock } from '../../lib/http'

jest.mock('discord-webhook-ts')

import DiscordWebhook from 'discord-webhook-ts'

// Tslint:disable-next-line:no-any
const discordClient = new DiscordWebhook('')
;(discordClient.execute as any).mockResolvedValue()

describe('ValidateError', () => {
	it('The set status code and error messages can be retrieved.', async () => {
		const context = getContextMock()
		const req = getHttpRequestMock({}, {})
		await httpTrigger(context, req)
		expect(context.res.status).toBe(415)
		expect(context.res.body).toBe('content-type is application/json only')
	})
})
