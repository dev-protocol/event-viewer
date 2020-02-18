/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable new-cap */
import { Entity, PrimaryColumn, Column, BaseEntity } from 'typeorm'

@Entity()
export class BeforeAllocation extends BaseEntity {
	@PrimaryColumn()
	public event_id!: string

	@Column()
	public block_number!: number

	@Column()
	public log_index!: number

	@Column()
	public transaction_index!: number

	@Column()
	public blocks!: number

	@Column()
	public mint!: number

	@Column()
	public value!: number

	@Column()
	public market_value!: number

	@Column()
	public assets!: number

	@Column()
	public total_assets!: number

	@Column()
	public raw!: string
}
