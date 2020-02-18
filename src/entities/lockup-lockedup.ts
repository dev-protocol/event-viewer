/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable new-cap */
import { Entity, PrimaryColumn, Column, BaseEntity } from 'typeorm'

@Entity()
export class LockupLockedup extends BaseEntity {
	@PrimaryColumn()
	public event_id!: string

	@Column()
	public block_number!: number

	@Column()
	public log_index!: number

	@Column()
	public transaction_index!: number

	@Column()
	public from_address!: number

	@Column()
	public property!: number

	@Column()
	public token_value!: number

	@Column()
	public raw_data!: string
}
