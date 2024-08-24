import { Module } from '@nestjs/common';
import { OrderLogController } from './order-logs.controller';
import { OrderLogService } from './order-logs.service';

@Module({
  providers: [OrderLogService, OrderLogService],
  controllers: [OrderLogController, OrderLogController],
  exports: [OrderLogService],
})
export class OrderLogsModule {}
