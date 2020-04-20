import { Context } from '@azure/functions'
import { EventSaverLogging } from './notifications'

export abstract class TimerBatchBase {
	private readonly _context: Context
	private readonly _myTimer: any

	constructor(context: Context, myTimer: any) {
		this._context = context
		this._myTimer = myTimer
	}

	public async execute(): Promise<void> {
		const logging = new EventSaverLogging(
			this._context.log,
			this.getBatchName()
		)
		try {
			await logging.start()
			if (this._myTimer.IsPastDue) {
				await logging.warning('Timer function is running late!')
			}

			await this.innerExecute(logging)
		} catch (err) {
			this._context.log.error(err.stack)
			await logging.error(err.message)
			throw err
		}

		await logging.finish()
	}

	abstract getBatchName(): string
	abstract async innerExecute(logging: EventSaverLogging): Promise<void>
}
