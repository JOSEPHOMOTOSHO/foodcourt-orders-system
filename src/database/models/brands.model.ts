import { Model } from 'objection';
import { Meal } from './meals.model';

export class Brand extends Model {
  static tableName = 'brands';

  id!: number;
  name!: string;
  description!: string;
  createdAt!: Date;
  updatedAt!: Date;

  static relationMappings = {
    meals: {
      relation: Model.HasManyRelation,
      modelClass: Meal,
      join: {
        from: 'brands.id',
        to: 'meals.brandId',
      },
    },
  };
}
