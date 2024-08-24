import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { OrderTypeService } from './order-types.service';
import { CreateOrderTypeDto, UpdateOrderTypeDto } from './dtos/order-types.dto';

@Controller('order-types')
export class OrderTypeController {
  constructor(private readonly orderTypeService: OrderTypeService) {}

  @Post()
  createOrderType(@Body() createOrderTypeDto: CreateOrderTypeDto) {
    return this.orderTypeService.createOrderType(createOrderTypeDto);
  }

  @Get(':id')
  getOrderTypeById(@Param('id') id: number) {
    return this.orderTypeService.getOrderTypeById(id);
  }

  @Put(':id')
  updateOrderType(@Param('id') id: number, @Body() updateOrderTypeDto: UpdateOrderTypeDto) {
    return this.orderTypeService.updateOrderType(id, updateOrderTypeDto);
  }

  @Delete(':id')
  deleteOrderType(@Param('id') id: number) {
    return this.orderTypeService.deleteOrderType(id);
  }

  @Get()
  getAllOrderTypes(@Query('page') page: number, @Query('limit') limit: number) {
    return this.orderTypeService.getAllOrderTypes(page, limit);
  }
}
