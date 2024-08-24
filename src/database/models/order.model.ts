import { Model } from 'objection';
import { OrderLog } from './order-logs.model';
import { CalculatedOrder } from './calculated-orders.model';
import { OrderType } from './order-types.model';

export class Order extends Model {
  static tableName = 'orders';

  id!: number;
  userId!: number;
  completed!: boolean;
  cancelled!: boolean;
  kitchenCancelled!: boolean;
  kitchenAccepted!: boolean;
  kitchenDispatched!: boolean;
  kitchenDispatchedTime!: Date;
  completedTime!: Date;
  riderId!: number;
  kitchenPrepared!: boolean;
  riderAssigned!: boolean;
  paid!: boolean;
  orderCode!: string;
  orderChange!: string | null;
  calculatedOrderId!: number;
  createdAt!: Date;
  updatedAt!: Date;
  kitchenVerifiedTime!: Date;
  kitchenCompletedTime!: Date;
  shopAccepted!: boolean;
  shopPrepared!: boolean;
  noOfMealbagsDelivered!: number;
  noOfDrinksDelivered!: number;
  riderStartedTime!: Date | null;
  riderStarted!: boolean;
  riderArrivedTime!: Date | null;
  riderArrived!: boolean;
  isFailedTrip!: boolean;
  failedTripDetails!: object;
  boxNumber!: string;
  shelfId!: number | null;
  scheduled!: boolean;
  confirmedById!: number | null;
  completedById!: number | null;
  scheduledDeliveryDate!: Date | null;
  scheduledDeliveryTime!: Date | null;
  isHidden!: boolean;
  orderTotalAmountHistory!: string;


  static relationMappings = {
    logs: {
      relation: Model.HasManyRelation,
      modelClass: OrderLog,
      join: {
        from: 'orders.id',
        to: 'order_logs.orderId',
      },
    },
    calculatedOrder: {
      relation: Model.BelongsToOneRelation,
      modelClass: CalculatedOrder,
      join: {
        from: 'orders.calculatedOrderId',
        to: 'calculated_orders.id',
      },
    },
    orderType: {
      relation: Model.BelongsToOneRelation,
      modelClass: OrderType,
      join: {
        from: 'orders.orderTypeId',
        to: 'order_types.id',
      },
    },
  };
}
