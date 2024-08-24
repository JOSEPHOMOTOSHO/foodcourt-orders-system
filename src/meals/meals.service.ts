import { Injectable, NotFoundException, Inject, BadRequestException} from '@nestjs/common';
// import { InjectModel } from '@willsoto/nestjs-objection';
import { Meal } from '../database/models/meals.model';
import { CreateMealDto, UpdateMealDto } from './dtos/meals.dto';
import { Brand } from 'src/database/models/brands.model';
import { isNameUnique } from 'src/util/isUnique.validations';

@Injectable()
export class MealService {

  async createMeal(brandId: number, createMealDto: CreateMealDto): Promise<Meal> {
    const brand = await Brand.query().findById(brandId);
    if (!brand) {
      throw new NotFoundException(`Brand with ID ${brandId} does not exist`);
    }

    if (
      !(await isNameUnique(Meal, createMealDto.name, undefined, { brandId }))
    ) {
      throw new BadRequestException(
        `Meal with name ${createMealDto.name} already exists for this brand`,
      );
    }

    return Meal.query().insert({ ...createMealDto, brandId });
  }

  async getMealById(brandId: number, mealId: number): Promise<Meal> {
    const brand = await Brand.query().findById(brandId);
    if (!brand) {
      throw new NotFoundException(`Brand with ID ${brandId} not found`);
    }

    const meal = await Meal.query()
      .where('id', mealId)
      .andWhere('brandId', brandId)
      .first();

    if (!meal) {
      throw new NotFoundException(
        `Meal with ID ${mealId} not found under brand ID ${brandId}`,
      );
    }

    return meal;
  }

  async updateMeal(brandId: number, mealId: number,  updateMealDto: UpdateMealDto): Promise<Meal> {
    const meal = await Meal.query()
      .where('id', mealId)
      .andWhere('brandId', brandId)
      .first();

    if (!meal) {
      throw new NotFoundException(
        `Meal with ID ${mealId} under brand ID ${brandId} not found`,
      );
    }

    if (updateMealDto.name && updateMealDto.name !== meal.name) {
      const isUnique = await isNameUnique(Meal, updateMealDto.name, mealId, {
        brandId: meal.brandId,
      });
      if (!isUnique) {
        throw new BadRequestException(
          `Meal with name ${updateMealDto.name} already exists for this brand`,
        );
      }
    }

    if (updateMealDto.availableNo === 0) {
      updateMealDto.active = false;
    }

    return Meal.query().patchAndFetchById(mealId, updateMealDto);
  }

  async deleteMeal(brandId: number, mealId: number,): Promise<void> {
    const meal = await Meal.query().where({ id: mealId, brandId }).first();

    if (!meal) {
      throw new NotFoundException(
        `Meal with ID ${mealId} under brand ID ${brandId} not found`,
      );
    }

    await Meal.query().deleteById(mealId);
  }

//   async getAllMeals(page: number, limit: number): Promise<Meal[]> {
//     return Meal.query().withGraphFetched('[addons, brand]').page(page, limit);
//   }
}
