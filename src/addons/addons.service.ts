import { Injectable, NotFoundException, Inject } from '@nestjs/common';
// import { InjectModel } from '@willsoto/nestjs-objection';
import { Addon } from '../database/models/addons.model';
import { CreateAddonDto, UpdateAddonDto } from './dtos/addons.dto';
import { Meal } from 'src/database/models/meals.model';

@Injectable()
export class AddonService {

  async createAddon(mealId: number, createAddonDto: CreateAddonDto): Promise<Addon> {
    const meal = await Meal.query().findById(mealId);
    if (!meal) {
      throw new NotFoundException(`Meal with ID ${mealId} not found`);
    }

    return Addon.query().insert({ ...createAddonDto, mealId });
  }

  async getAddonById( mealId:number, id: number): Promise<Addon> {
    const addon = await Addon.query().where({ id, mealId }).first();
    if (!addon) {
      throw new NotFoundException(
        `Addon with ID ${id} not found under meal with ID ${mealId}`,
      );
    }
    return addon;
  }

  async updateAddon(mealId: number, id: number, updateAddonDto: UpdateAddonDto): Promise<Addon> {
    const meal = await Meal.query().findById(mealId);
    if (!meal) {
      throw new NotFoundException(`Meal with ID ${mealId} not found`);
    }

    const addon = await Addon.query().where({ id, mealId }).first();
    if (!addon) {
      throw new NotFoundException(
        `Addon with ID ${id} not found under meal with ID ${mealId}`,
      );
    }

    return Addon.query().patchAndFetchById(id, updateAddonDto);
  }

  async deleteAddon(mealId: number, id: number): Promise<void> {
    const addon = await Addon.query().where({ id, mealId }).first();
    if (!addon) {
      throw new NotFoundException(
        `Addon with ID ${id} not found under meal with ID ${mealId}`,
      );
    }

    await Addon.query().deleteById(id);
  }

  async getAllAddons(mealId: number): Promise<Addon[]> {
    const meal = await Meal.query().findById(mealId);
    if (!meal) {
      throw new NotFoundException(`Meal with ID ${mealId} not found`);
    }
    return Addon.query().where('mealId', mealId);
  }
}
