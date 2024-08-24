import { Injectable, NotFoundException, Inject} from '@nestjs/common';
import { OrderLog } from '../database/models/order-logs.model';
import { CreateOrderLogDto, UpdateOrderLogDto } from './dtos/order-logs.dto';
import { Order } from 'src/database/models/order.model';

@Injectable()
export class OrderLogService {

  async createOrderLog(orderId:number, createOrderLogDto: CreateOrderLogDto): Promise<OrderLog> {
    const order = await Order.query().findById(orderId);
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    return OrderLog.query().insert({
      ...createOrderLogDto,
      orderId,
    });
  }

  async getOrderLogById(orderId:number, logId: number): Promise<OrderLog> {
    const order = await Order.query().findById(orderId);
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    const orderLog = await OrderLog.query()
      .where({ id: logId, orderId })
      .first();
    if (!orderLog) {
      throw new NotFoundException(
        `OrderLog with ID ${logId} not found for order ${orderId}`,
      );
    }

    return orderLog;
  }

  async updateOrderLog(orderId: number, logId:number, updateOrderLogDto: UpdateOrderLogDto): Promise<OrderLog> {
    const orderExists = await Order.query().findById(orderId);
    if (!orderExists) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    const orderLog = await OrderLog.query().findById(logId);
    if (!orderLog || orderLog.orderId !== orderId) {
      throw new NotFoundException(
        `OrderLog with ID ${logId} not found for order ${orderId}`,
      );
    }

    return OrderLog.query().patchAndFetchById(logId, updateOrderLogDto);
  }

  async deleteOrderLog(orderId: number, logId:number): Promise<void> {
    const orderExists = await Order.query().findById(orderId);
    if (!orderExists) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    const orderLog = await OrderLog.query().findById(logId);
    if (!orderLog || orderLog.orderId !== orderId) {
      throw new NotFoundException(
        `OrderLog with ID ${logId} not found for order ${orderId}`,
      );
    }

    await OrderLog.query().deleteById(logId);
  }

  async getAllOrderLogs(orderId: number): Promise<OrderLog[]> {
    return OrderLog.query().where('orderId', orderId);
  }
}
