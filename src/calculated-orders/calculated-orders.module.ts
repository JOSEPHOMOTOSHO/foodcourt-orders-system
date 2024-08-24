import { Module } from '@nestjs/common';
import { CalculatedOrderService } from './calculated-orders.service';
import { CalculatedOrderController } from './calculated-orders.controller';

@Module({
  providers: [CalculatedOrderService],
  controllers: [CalculatedOrderController]
})
export class CalculatedOrdersModule {}
