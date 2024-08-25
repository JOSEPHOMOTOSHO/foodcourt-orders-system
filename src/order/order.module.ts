import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderLogsModule } from 'src/order-logs/order-logs.module';
import { WebsocketsGatewayModule } from 'src/gateway/websockets.module';


@Module({
  imports: [OrderLogsModule, WebsocketsGatewayModule],
  providers: [OrderService ],
  controllers: [OrderController]
})
export class OrdersModule {}
