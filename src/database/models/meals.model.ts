import { Model } from 'objection';
import { Addon } from './addons.model';
import { Brand } from './brands.model';

export class Meal extends Model {
  static tableName = 'meals';

  id!: number;
  name!: string;
  description!: string;
  price!: number;
  brandId!: number;
  active!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
  amount!: number;
  alcohol!: boolean;
  itemNo!: string | null;
  summary!: string | null;
  calories!: string;
  isAddon!: boolean;
  isCombo!: boolean;
  position!: number;
  quantity!: number;
  homePage!: boolean;
  itemType!: string;
  mealTags!: string[];
  orderNote!: string;
  availableNo!: number;
  mealKeywords!: string[];
  internalProfit!: number;
  mealCategoryId!: string;


  static relationMappings = {
    addons: {
      relation: Model.HasManyRelation,
      modelClass: Addon,
      join: {
        from: 'meals.id',
        to: 'addons.mealId',
      },
    },
    brand: {
      relation: Model.BelongsToOneRelation,
      modelClass: Brand,
      join: {
        from: 'meals.brandId',
        to: 'brands.id',
      },
    },
  };
}
