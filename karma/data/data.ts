export class PropertyBalance {
	private readonly _property: string
	private readonly _balance: number

	constructor(property: string, balance: number) {
		this._property = property
		this._balance = balance
	}

	get property(): string {
		return this._property
	}

	get balance(): number {
		return this._balance
	}
}

export class PropertyLockupSumValues {
	private readonly _property: string
	private readonly _sumValues: number

	constructor(property: string, sumValues: number) {
		this._property = property
		this._sumValues = sumValues
	}

	get property(): string {
		return this._property
	}

	get sumValues(): number {
		return this._sumValues
	}
}

export class PropertyMeta {
	private readonly _property: string
	private readonly _toralSupply: number

	constructor(property: string, toralSupply: number) {
		this._property = property
		this._toralSupply = toralSupply
	}

	get property(): string {
		return this._property
	}

	get toralSupply(): number {
		return this._toralSupply
	}
}
