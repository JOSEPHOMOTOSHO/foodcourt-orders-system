import { Injectable, NotFoundException, Inject} from '@nestjs/common';
import { CalculatedOrder } from '../database/models/calculated-orders.model';
import { CreateCalculatedOrderDto, UpdateCalculatedOrderDto } from './dtos/calculated-orders.dto';
import { Meal } from 'src/database/models/meals.model';
import { Addon } from 'src/database/models/addons.model';

@Injectable()
export class CalculatedOrderService {

  async createCalculatedOrder(createCalculatedOrderDto: CreateCalculatedOrderDto): Promise<Object> {
    let totalAmount = createCalculatedOrderDto.serviceCharge;

    if (!createCalculatedOrderDto.freeDelivery) {
      totalAmount += createCalculatedOrderDto.deliveryFee;
    }

    const mealDetailsArray = [];

    for (const mealDetail of createCalculatedOrderDto.mealsDetails) {
      const meal = await Meal.query().findById(mealDetail.mealId);
      if (!meal) {
        throw new NotFoundException(
          `Meal with ID ${mealDetail.mealId} not found`,
        );
      }
      totalAmount += Number(meal.amount) * Number(mealDetail.quantity);

      const addonsArray = [];

      for (const addonDetail of mealDetail.addons) {
        const addon = await Addon.query().findById(addonDetail.addonId);
        if (!addon) {
          throw new NotFoundException(
            `Addon with ID ${addonDetail.addonId} not found`,
          );
        }
        totalAmount += Number(addon.amount);

        addonsArray.push({ addonId: addon.id, addonAmount: addon.amount });
      }

      mealDetailsArray.push({
        mealId: meal.id,
        quantity: mealDetail.quantity,
        addons: addonsArray,
      });
    }

    const calculatedOrderData = {
      totalAmount,
      deliveryFee: createCalculatedOrderDto.deliveryFee,
      serviceCharge: createCalculatedOrderDto.serviceCharge,
      freeDelivery: createCalculatedOrderDto.freeDelivery,
      addressDetails: createCalculatedOrderDto.addressDetails,
      mealsDetails: JSON.stringify(mealDetailsArray),
    };

    const createdOrder =
      await CalculatedOrder.query().insert(calculatedOrderData);
    const responseOrder = {
      ...createdOrder,
      mealDetails: mealDetailsArray,
    };

    return responseOrder;
  }

  async getCalculatedOrderById(id: number): Promise<CalculatedOrder> {
    const calculatedOrder = await CalculatedOrder.query().findById(id);
    if (!calculatedOrder) {
      throw new NotFoundException(`CalculatedOrder with ID ${id} not found`);
    }
    return calculatedOrder;
  }

  async updateCalculatedOrder(id: number, updateCalculatedOrderDto: UpdateCalculatedOrderDto): Promise<CalculatedOrder> {
    const order = await CalculatedOrder.query().findById(id);
    if (!order) {
      throw new NotFoundException(`CalculatedOrder with ID ${id} not found`);
    }

    let totalAmount = updateCalculatedOrderDto.serviceCharge;

    if (!updateCalculatedOrderDto.freeDelivery) {
      totalAmount += updateCalculatedOrderDto.deliveryFee;
    }

    for (const mealDetail of updateCalculatedOrderDto.mealsDetails) {
      const meal = await Meal.query().findById(mealDetail.mealId);
      if (!meal) {
        throw new NotFoundException(
          `Meal with ID ${mealDetail.mealId} not found`,
        );
      }
      totalAmount += Number(meal.amount) * Number(mealDetail.quantity);

      for (const addonDetail of mealDetail.addons) {
        const addon = await Addon.query().findById(addonDetail.addonId);
        if (!addon) {
          throw new NotFoundException(
            `Addon with ID ${addonDetail.addonId} not found`,
          );
        }
        totalAmount += Number(addon.amount);
      }
    }

    const updatedOrder = await CalculatedOrder.query().patchAndFetchById(id, {
      ...updateCalculatedOrderDto,
      totalAmount,
      mealsDetails:
        typeof updateCalculatedOrderDto.mealsDetails === 'string'
          ? updateCalculatedOrderDto.mealsDetails
          : JSON.stringify(updateCalculatedOrderDto.mealsDetails),
    });

    if (typeof updatedOrder.mealsDetails === 'string') {
      updatedOrder.mealsDetails = JSON.parse(updatedOrder.mealsDetails);
    }

    return updatedOrder;
  }

  async deleteCalculatedOrder(id: number): Promise<void> {
    const rowsDeleted = await CalculatedOrder.query().deleteById(id);
    if (!rowsDeleted) {
      throw new NotFoundException(`CalculatedOrder with ID ${id} not found`);
    }
  }

  async getAllCalculatedOrders(): Promise<CalculatedOrder[]> {
    return CalculatedOrder.query();
  }
}
