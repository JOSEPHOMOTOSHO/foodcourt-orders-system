import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrdersGateway } from './orders.gateway';
import { OrderLogsModule } from 'src/order-logs/order-logs.module';


@Module({
  imports: [OrderLogsModule],
  providers: [OrderService, OrdersGateway],
  controllers: [OrderController]
})
export class OrdersModule {}
