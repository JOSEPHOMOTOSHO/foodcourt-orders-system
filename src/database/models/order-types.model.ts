import { Model } from 'objection';
import { Order } from './order.model';

export class OrderType extends Model {
  static tableName = 'order_types';

  id!: string;
  name!: string;
  createdAt!: Date;
  updatedAt!: Date;

  static relationMappings = {
    orders: {
      relation: Model.HasManyRelation,
      modelClass: Order,
      join: {
        from: 'order_types.id',
        to: 'orders.orderTypeId',
      },
    },
  };

}
