/* eslint-disable new-cap */
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm'

@Entity()
export class PropertyAuthentication extends BaseEntity {
	@PrimaryGeneratedColumn()
	public readonly id: number

	@Column()
	public block_number!: number

	@Column()
	public property!: string

	@Column()
	public metrics!: string

	@Column()
	public market!: string

	@Column()
	public authentication_id!: string
}
