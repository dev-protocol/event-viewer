import { getRepository, ObjectType } from 'typeorm'

export async function getMaxBlockNumber<Entity>(
	entityClass: ObjectType<Entity>
): Promise<number> {
	let { max } = await getRepository(entityClass)
		.createQueryBuilder()
		.select('MAX(block_number)', 'max')
		.getRawOne()
	if (max === null) {
		max = 0
	}

	return Number(max)
}
