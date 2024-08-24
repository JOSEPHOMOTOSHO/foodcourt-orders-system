import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { CalculatedOrderService } from './calculated-orders.service';
import { CreateCalculatedOrderDto, UpdateCalculatedOrderDto } from './dtos/calculated-orders.dto';

@Controller('calculated-orders')
export class CalculatedOrderController {
  constructor(private readonly calculatedOrderService: CalculatedOrderService) {}

  @Post()
  createCalculatedOrder(@Body() createCalculatedOrderDto: CreateCalculatedOrderDto) {
    return this.calculatedOrderService.createCalculatedOrder(createCalculatedOrderDto);
  }

  @Get(':id')
  getCalculatedOrderById(@Param('id', ParseIntPipe) id: number) {
    return this.calculatedOrderService.getCalculatedOrderById(id);
  }

  @Put(':id')
  updateCalculatedOrder(@Param('id', ParseIntPipe) id: number, @Body() updateCalculatedOrderDto: UpdateCalculatedOrderDto) {
    return this.calculatedOrderService.updateCalculatedOrder(id, updateCalculatedOrderDto);
  }

  @Delete(':id')
  deleteCalculatedOrder(@Param('id', ParseIntPipe) id: number) {
    return this.calculatedOrderService.deleteCalculatedOrder(id);
  }

  @Get()
  getAllCalculatedOrders() {
    return this.calculatedOrderService.getAllCalculatedOrders();
  }
}
