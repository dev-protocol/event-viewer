export function isNotEmpty(str: string): boolean {
	if (typeof str === 'undefined') {
		return false
	}

	if (str === null) {
		return false
	}

	if (str === '') {
		return false
	}

	return true
}

export function getTargetRecordsSeparatedByBlockNumber<
	T extends { block_number: number }
>(records: T[], maxCount: number): T[] {
	const targetRecords: any[] = []
	let lastBlockNumber = 0
	for (let record of records) {
		if (targetRecords.length >= maxCount) {
			if (lastBlockNumber !== record.block_number) {
				break
			}
		}

		targetRecords.push(record)
		lastBlockNumber = record.block_number
	}

	return targetRecords
}
