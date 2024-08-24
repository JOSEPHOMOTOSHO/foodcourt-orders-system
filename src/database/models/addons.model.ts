import { Model } from 'objection';
import { Meal } from './meals.model';

export class Addon extends Model {
  static tableName = 'addons';

  id!: number;
  amount!: number;
  mealId!: number;
  mealData!: object;
  createdAt!: Date;
  updatedAt!: Date;
  mealAddonId!: string;
  internalProfit!: number;
  minSelectionNo!: number;
  mealAddonCategoryId!: string;

  static relationMappings = {
    meal: {
      relation: Model.BelongsToOneRelation,
      modelClass: Meal,
      join: {
        from: 'addons.mealId',
        to: 'meals.id',
      },
    },
  };
}
