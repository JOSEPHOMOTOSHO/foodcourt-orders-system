import { Injectable, NotFoundException , Inject} from '@nestjs/common';
import { Order } from '../database/models/order.model';
import { CreateOrderDto, UpdateOrderDto } from './dtos/order.dto';
import { OrdersGateway } from './orders.gateway';
import { OrderLog } from '../database/models/order-logs.model';
import { generateOrderCode } from 'src/util/orderCode.utils';
import { CalculatedOrder } from '../database/models/calculated-orders.model';
import { CreateOrderLogDto } from 'src/order-logs/dtos/order-logs.dto';
import { OrderLogService } from 'src/order-logs/order-logs.service';
import { Page } from 'objection';

@Injectable()
export class OrderService {
  constructor( private ordersGateway: OrdersGateway, private readonly orderLogService: OrderLogService
) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const calculatedOrder = await CalculatedOrder.query().findById(
      createOrderDto.calculatedOrderId
    );
    if (!calculatedOrder) {
      throw new NotFoundException(
        `CalculatedOrder with ID ${createOrderDto.calculatedOrderId} not found`,
      );
    }

    const newOrder = await Order.query().insert({
      ...createOrderDto,
      completed: false,
      cancelled: false,
      kitchenAccepted: false,
      paid: false,
      orderCode: generateOrderCode(createOrderDto.userId),
      orderTotalAmountHistory: JSON.stringify([
        {
          time: new Date().toISOString(),
          totalAmount: calculatedOrder.totalAmount,
        },
      ]),
    });

    const logEntry: CreateOrderLogDto = {
      time: new Date(),
      description: `Order with ID ${newOrder.id} created successfully.`,
    };
    await this.orderLogService.createOrderLog(newOrder.id, logEntry);

    return newOrder;
  }

  async getOrderById(id: number): Promise<Order> {
    const order = await Order.query().findById(id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async updateOrder(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const existingOrder = await Order.query().findById(id);
    if (!existingOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    const totalAmountHistory = JSON.parse(
      existingOrder.orderTotalAmountHistory || '[]',
    );

    if (
      updateOrderDto.calculatedOrderId &&
      updateOrderDto.calculatedOrderId !== existingOrder.calculatedOrderId
    ) {
      const calculatedOrder = await CalculatedOrder.query().findById(
        updateOrderDto.calculatedOrderId,
      );
      if (!calculatedOrder) {
        throw new NotFoundException(
          `CalculatedOrder with ID ${updateOrderDto.calculatedOrderId} not found`,
        );
      }
      totalAmountHistory.push({
        time: new Date().toISOString(),
        totalAmount: calculatedOrder.totalAmount,
      });
    }

    const updatedOrder = await Order.query().patchAndFetchById(id, {
      ...updateOrderDto,
      orderTotalAmountHistory: JSON.stringify(totalAmountHistory),
    });

    const updateLog = {
      time: new Date(),
      description: `Order with ID ${id} updated`,
    };
    await this.orderLogService.createOrderLog(id, updateLog);

    updatedOrder.orderTotalAmountHistory = totalAmountHistory;

    return updatedOrder;
  }

  async deleteOrder(id: number): Promise<void> {
    const rowsDeleted = await Order.query().deleteById(id);
    if (!rowsDeleted) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
  }

  async processOrder(id: number): Promise<Order> {
    // Fetch the order with related data
    const order = await Order
      .query()
      .findById(id)
      .withGraphFetched('[calculatedOrder.[meals.addons], logs]');
      console.log("order", order)
  
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
  
    // Validate order status
    if (order.completed || order.cancelled) {
      throw new Error('Order is already completed or cancelled');
    }
  
    // Check kitchen processes
    console.log(order)
    if (!order.kitchenAccepted || !order.kitchenPrepared || !order.kitchenDispatched) {
      await OrderLog.query().insert({
        orderId: order.id,
        description: `Order processed and completed with total amount ${700}`,
        time: new Date(),
      });
    }
    /***
     * calculatedOrder will have the orderId and details partaining what was ordered
     */
  
    // Calculate the total order amount including addons
    // const totalAmount = order.calculatedOrder!.meals.reduce((sum, meal) => {
    //   const addonsTotal = meal.addons.reduce((addonSum, addon) => addonSum + addon.amount, 0);
    //   return sum + meal.price + addonsTotal;
    // }, 0);
  
    // Update order details
    order.completed = true;
    order.completedTime = new Date();
    // order.calculatedOrder.totalAmount = totalAmount;  // Update total amount in CalculatedOrder
  
    await order.$query().patch();
  
    // Log the order update
    await OrderLog.query().insert({
      orderId: order.id,
      description: `Order processed and completed with total amount ${7}`,
      time: new Date(),
    });
  
    // Push order status updates to WebSocket
    this.ordersGateway.notifyOrderUpdate(order);
  
    return order;
  }
  
  async getAllOrders(page: number, limit: number): Promise<Page<Order>> {
    return Order.query().withGraphFetched('[logs, calculatedOrder]').page(page, limit);
  }
}
