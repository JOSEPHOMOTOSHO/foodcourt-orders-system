import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { OrdersModule } from './order/order.module';
import { ConfigModule } from '@nestjs/config';
import { OrderLogsModule } from './order-logs/order-logs.module';
import { CalculatedOrdersModule } from './calculated-orders/calculated-orders.module';
import { MealsModule } from './meals/meals.module';
import { AddonsModule } from './addons/addons.module';
import { BrandsModule } from './brands/brands.module';
import { OrderTypesModule } from './order-types/order-types.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule, 
    OrdersModule, OrderLogsModule, CalculatedOrdersModule, MealsModule, AddonsModule, BrandsModule, OrderTypesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
