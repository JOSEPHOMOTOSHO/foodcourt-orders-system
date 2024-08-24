import { Injectable, NotFoundException,Inject, ConflictException } from '@nestjs/common';
// import { InjectModel } from '@willsoto/nestjs-objection';
import { OrderType } from '../database/models/order-types.model';
import { CreateOrderTypeDto, UpdateOrderTypeDto } from './dtos/order-types.dto';
import { isNameUnique } from 'src/util/isUnique.validations';
import { Page } from 'objection';

@Injectable()
export class OrderTypeService {
  constructor() {}

  async createOrderType(createOrderTypeDto: CreateOrderTypeDto): Promise<OrderType> {
    const uniqueOrderType = await isNameUnique(OrderType, CreateOrderTypeDto.name);
    if (!uniqueOrderType) {
      throw new ConflictException(
        `OrderType with name "${CreateOrderTypeDto.name}" already exists`,
      );
    }

    return OrderType.query().insert(createOrderTypeDto);
  }

  async getOrderTypeById(id: number): Promise<OrderType> {
    const orderType = await OrderType.query().findById(id);
    if (!orderType) {
      throw new NotFoundException(`OrderType with ID ${id} not found`);
    }
    return orderType;
  }

  async updateOrderType(id: number, updateOrderTypeDto: UpdateOrderTypeDto): Promise<OrderType> {
    if (updateOrderTypeDto.name) {
      const unique = await isNameUnique(OrderType, updateOrderTypeDto.name, id);
      if (!unique) {
        throw new ConflictException(
          `OrderType with name "${updateOrderTypeDto.name}" already exists`,
        );
      }
    }

    const updatedOrderType = await OrderType.query().patchAndFetchById(
      id,
      updateOrderTypeDto,
    );
    if (!updatedOrderType) {
      throw new NotFoundException(`OrderType with ID ${id} not found`);
    }
    return updatedOrderType;
  }

  async deleteOrderType(id: number): Promise<void> {
    const rowsDeleted = await OrderType.query().deleteById(id);
    if (!rowsDeleted) {
      throw new NotFoundException(`OrderType with ID ${id} not found`);
    }
  }

  async getAllOrderTypes(page: number, limit: number): Promise<Page<OrderType>> {
    return OrderType.query().page(page, limit);
  }
}
