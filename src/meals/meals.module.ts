import { Module } from '@nestjs/common';
import { MealService } from './meals.service';
import { MealController } from './meals.controller';

@Module({
  providers: [MealService],
  controllers: [MealController]
})
export class MealsModule {}
