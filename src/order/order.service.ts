import { Injectable, NotFoundException , Inject} from '@nestjs/common';
import { Order } from '../database/models/order.model';
import { CreateOrderDto, UpdateOrderDto } from './dtos/order.dto';
import { OrderLog } from '../database/models/order-logs.model';
import { generateOrderCode } from 'src/util/orderCode.utils';
import { CalculatedOrder } from '../database/models/calculated-orders.model';
import { CreateOrderLogDto } from 'src/order-logs/dtos/order-logs.dto';
import { OrderLogService } from 'src/order-logs/order-logs.service';
import { Page } from 'objection';
import { WebsocketsGateway} from "../gateway/websockets.gateway"
@Injectable()
export class OrderService {
  constructor(private readonly websocketsGateway: WebsocketsGateway,  readonly orderLogService: OrderLogService) {} 

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
      .withGraphFetched('[calculatedOrder, logs]');
  
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
  
    if (order.completed ) {
      throw new Error('Order is already completed');
    }

    if (order.cancelled) {
      throw new Error('Order is cancelled');
    }
  
    if (!order.kitchenAccepted) {
      
      this.websocketsGateway.notifyOrderUpdate('Order not yet accepted by kitchen');
      throw new Error('Order not yet accepted by kitchen');

    } else if (order.kitchenAccepted && !order.kitchenPrepared) {

      this.websocketsGateway.notifyOrderUpdate('Order accepted by kitchen');
      await this.orderLogService.createOrderLog(id, {
        time: new Date(),
        description: 'Order accepted by kitchen',
      });

    } else if (order.kitchenPrepared && !order.kitchenDispatched) {

      this.websocketsGateway.notifyOrderUpdate('Order completed by kitchen');
      await this.orderLogService.createOrderLog(id, {
        time: new Date(),
        description: 'Order completed by kitchen',
      });

    } else if (order.kitchenDispatched && !order.riderArrived) {

      await Order.query().patchAndFetchById(id, { riderArrived: true });
      this.websocketsGateway.notifyOrderUpdate('Order dispatched by front desk');
      await this.orderLogService.createOrderLog(id, {
        time: new Date(),
        description: 'Order dispatched by front desk',
      });

    } else if (order.kitchenDispatched && order.riderArrived) {

      this.websocketsGateway.notifyOrderUpdate('Order dispatched by front desk');
      await Order.query().patchAndFetchById(id, { riderArrived: true });
      await this.orderLogService.createOrderLog(id, {
        time: new Date(),
        description: 'Order dispatched by front desk',
      });

      this.websocketsGateway.notifyOrderUpdate(`Order completed`);
      await Order.query().patchAndFetchById(id, {
        completed: true,
        completedTime: new Date(),
      });
    } else {
      throw new Error('Order has already been processed');
    }
  
    return order;
  }
  
  async getAllOrders(page: number, limit: number): Promise<Page<Order>> {
    return Order.query().withGraphFetched('[logs, calculatedOrder]').page(page, limit);
  }
}
