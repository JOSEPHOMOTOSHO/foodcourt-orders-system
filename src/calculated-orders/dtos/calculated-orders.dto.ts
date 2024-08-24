import { Type } from 'class-transformer';
import { IsNotEmpty, IsBoolean, IsOptional, IsNumber, IsJSON, IsObject, ValidateNested, IsArray } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';


class AddressDetailsDto {
  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  addressLine: string;

  @IsNotEmpty()
  buildingNumber: string;
}

class AddonDto {
  @IsNumber()
  addonId: number;
}

class MealsDetailsDto {
  @IsNumber()
  mealId: number;

  @IsNumber()
  quantity: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddonDto)
  addons: AddonDto[];
}

export class CreateCalculatedOrderDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsBoolean()
  @IsOptional()
  freeDelivery?: boolean;

  @IsNumber()
  @IsOptional()
  deliveryFee?: number;

  @IsNumber()
  @IsOptional()
  serviceCharge?: number;

  @IsObject()
  @ValidateNested()
  @Type(() => AddressDetailsDto)
  addressDetails: AddressDetailsDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MealsDetailsDto)
  mealsDetails: MealsDetailsDto[];
}

export class UpdateCalculatedOrderDto extends PartialType(
  CreateCalculatedOrderDto,
) {}