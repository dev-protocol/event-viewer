/* eslint-disable new-cap */
import { Entity, PrimaryColumn, Column, BaseEntity } from 'typeorm'

@Entity()
export class RewardCalculationResult extends BaseEntity {
	@PrimaryColumn()
	public alocator_allocation_result_event_id!: string

	@Column()
	public block_number!: number

	@Column()
	public metrics!: string

	@Column()
	public lockup!: number

	@Column()
	public allocate_result!: number

	@Column()
	public holder_reward!: number

	@Column()
	public staking_reward!: number

	@Column()
	public policy!: string
}
