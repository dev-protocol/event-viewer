/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable new-cap */
import { Entity, PrimaryColumn, Column, BaseEntity } from 'typeorm'

@Entity()
export class ContractAddress extends BaseEntity {
	@PrimaryColumn()
	public batch_name!: string

	@Column()
	public contract_address!: string
}
