import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { OrderLogService } from './order-logs.service';
import { CreateOrderLogDto, UpdateOrderLogDto } from './dtos/order-logs.dto';

@Controller('orders/:orderId/logs')
export class OrderLogController {
  constructor(private readonly orderLogService: OrderLogService) {}

  @Post()
  createOrderLog(@Param('orderId', ParseIntPipe) orderId: number, @Body() createOrderLogDto: CreateOrderLogDto) {
    return this.orderLogService.createOrderLog(orderId, createOrderLogDto);
  }

  @Get(':logId')
  getOrderLogById(@Param('orderId', ParseIntPipe) orderId: number, @Param('logId', ParseIntPipe) logId: number,) {
    return this.orderLogService.getOrderLogById(orderId,logId);
  }

  @Put(':logId')
  updateOrderLog(@Param('orderId', ParseIntPipe) orderId: number, @Param('logId', ParseIntPipe) logId: number, @Body() updateOrderLogDto: UpdateOrderLogDto) {
    return this.orderLogService.updateOrderLog(orderId, logId, updateOrderLogDto);
  }

  @Delete(':logId')
  deleteOrderLog(@Param('orderId', ParseIntPipe) orderId: number, @Param('logId', ParseIntPipe) logId: number,) {
    return this.orderLogService.deleteOrderLog(orderId, logId);
  }

  @Get('order/:orderId')
  getAllOrderLogs(@Param('orderId') orderId: number) {
    return this.orderLogService.getAllOrderLogs(orderId);
  }
}
