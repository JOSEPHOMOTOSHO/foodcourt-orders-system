import { Module } from '@nestjs/common';
import { OrderTypeService } from './order-types.service';
import { OrderTypeController } from './order-types.controller';

@Module({
  providers: [OrderTypeService],
  controllers: [OrderTypeController]
})
export class OrderTypesModule {}
