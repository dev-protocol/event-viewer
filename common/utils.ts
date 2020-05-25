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
