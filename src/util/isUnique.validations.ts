import { Model } from 'objection';

export async function isNameUnique(
  model: typeof Model,
  name: string,
  excludeId?: number,
  conditions: Record<string, any> = {},
): Promise<boolean> {
  const query = model
    .query()
    .whereRaw('LOWER(name) = ?', name.toLowerCase())
    .andWhere(conditions);

  if (excludeId) {
    query.andWhereNot('id', excludeId);
  }

  const count = await query.resultSize();
  return count === 0;
}
