import { mocked } from 'ts-jest/utils'
import { getContextMock, getTimerMock } from '../../lib/mock'
import { TimerBatchBase } from '../../../common/base'
import { EventSaverLogging } from '../../../common/notifications'

const context = getContextMock()

jest.mock('../../../common/notifications')

const TEST_FUNC_NAME = 'test-func-name'

// eslint-disable-next-line @typescript-eslint/no-empty-function
// const start = jest.fn().mockResolvedValue(() => {})
// EventSaverLogging.mockImplementation(() => {
// 	return {
// 		start: start,
// 	}
// })

// Const logging = new EventSaverLogging(context, TEST_FUNC_NAME)
// ;(logging.start as any).mockResolvedValue()
// ;(logging.warning as any).mockResolvedValue()
// ;(logging.error as any).mockResolvedValue()
// ;(logging.finish as any).mockResolvedValue()

class TestTimerBatchBase extends TimerBatchBase {
	getBatchName(): string {
		return TEST_FUNC_NAME
	}

	async innerExecute(): Promise<void> {
		const sleep = async (time: number): Promise<number> => {
			return new Promise<number>((resolve) => {
				setTimeout(() => {
					resolve(time)
				}, time)
			})
		}

		await sleep(1)
	}
}

describe('TimerBatchBase', () => {
	beforeEach(() => {
		mocked(EventSaverLogging).mockClear()
	})
	it('null is recognized as an empty string.', async () => {
		const timer = getTimerMock()
		const timerBatch = new TestTimerBatchBase(context, timer)
		await timerBatch.execute()
		expect(EventSaverLogging).toHaveBeenCalledTimes(1)
	})
})
