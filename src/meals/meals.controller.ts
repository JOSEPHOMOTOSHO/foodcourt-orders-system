import { Controller, Get, Post, Put, Delete, Param, Body, Query, HttpCode, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { MealService } from './meals.service';
import { CreateMealDto, UpdateMealDto } from './dtos/meals.dto';

@Controller('brands/:brandId/meals')
export class MealController {
  constructor(private readonly mealService: MealService) {}

  @Post()
  createMeal(@Param('brandId', ParseIntPipe) brandId: number, @Body() createMealDto: CreateMealDto) {
    return this.mealService.createMeal(brandId, createMealDto);
  }

  @Get(':mealId')
  getMealById(@Param('brandId', ParseIntPipe) brandId: number, @Param('mealId', ParseIntPipe) mealId: number) {
    return this.mealService.getMealById(brandId, mealId);
  }

  @Put(':mealId')
  updateMeal(@Param('brandId', ParseIntPipe) brandId: number, @Param('mealId', ParseIntPipe) mealId: number,  @Body() updateMealDto: UpdateMealDto) {
    return this.mealService.updateMeal(brandId, mealId, updateMealDto);
  }

  @Delete(':mealId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteMeal(@Param('brandId', ParseIntPipe) brandId: number, @Param('mealId', ParseIntPipe) mealId: number) {
    return this.mealService.deleteMeal(brandId, mealId);
  }

//   @Get()
//   getAllMeals(@Query('page') page: number, @Query('limit') limit: number) {
//     return this.mealService.getAllMeals(page, limit);
//   }
}
