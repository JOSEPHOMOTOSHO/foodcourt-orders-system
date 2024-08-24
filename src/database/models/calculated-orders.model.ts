import { Model } from 'objection';
import { Meal } from './meals.model';

export class CalculatedOrder extends Model {
  static tableName = 'calculated_orders';

  id!: number;
  totalAmount!: number;
  freeDelivery!: boolean;
  deliveryFee!: number;
  serviceCharge!: number;
  addressDetails!: {
    city: string;
    name: string;
    addressLine: string;
    buildingNumber: string;
  };
  lat!: string;
  lng!: string;
  cokitchenPolygonId!: string;
  cokitchenId!: number;
  pickup!: boolean;
  prevPrice!: number;
  mealsDetails!: string;

  static relationMappings = {
    meals: {
      relation: Model.HasManyRelation,
      modelClass: Meal,
      join: {
        from: 'calculated_orders.id',
        to: 'meals.calculatedOrderId',
      },
    },
  };
}
