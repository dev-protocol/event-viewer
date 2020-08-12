export class PostError extends Error {
	_status: number
	constructor(status: number, m: string) {
		super(m)
		this._status = status
	}

	get status(): number {
		return this._status
	}
}
