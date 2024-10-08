import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsNotEmpty, IsBoolean, IsOptional, IsNumber, IsDateString, IsString, IsInt, IsJSON, IsArray, ValidateNested, IsObject } from "class-validator";

export class CreateOrderDto {
  @IsInt()
  userId: number;

  @IsBoolean()
  completed: boolean;

  @IsBoolean()
  cancelled: boolean;

  @IsBoolean()
  kitchenCancelled: boolean;

  @IsBoolean()
  kitchenAccepted: boolean;

  @IsBoolean()
  kitchenDispatched: boolean;

  @IsOptional()
  @IsDateString()
  kitchenDispatchedTime?: Date;

  @IsOptional()
  @IsDateString()
  completedTime?: Date;

  @IsOptional()
  @IsInt()
  riderId?: number;

  @IsBoolean()
  kitchenPrepared: boolean;

  @IsBoolean()
  riderAssigned: boolean;

  @IsBoolean()
  paid: boolean;

  @IsString()
  orderCode: string;

  @IsOptional()
  @IsString()
  orderChange?: string;

  @IsOptional()
  @IsInt()
  calculatedOrderId?: number;

  @IsDateString()
  createdAt: Date;

  @IsDateString()
  updatedAt: Date;

  @IsOptional()
  @IsDateString()
  kitchenVerifiedTime?: Date;

  @IsOptional()
  @IsDateString()
  kitchenCompletedTime?: Date;

  @IsBoolean()
  shopAccepted: boolean;

  @IsBoolean()
  shopPrepared: boolean;

  @IsInt()
  noOfMealbagsDelivered: number;

  @IsInt()
  noOfDrinksDelivered: number;

  @IsOptional()
  @IsDateString()
  riderStartedTime?: Date;

  @IsBoolean()
  riderStarted: boolean;

  @IsOptional()
  @IsDateString()
  riderArrivedTime?: Date;

  @IsBoolean()
  riderArrived: boolean;

  @IsBoolean()
  isFailedTrip: boolean;

  @IsOptional()
  @IsJSON()
  failedTripDetails?: object;

  @IsString()
  boxNumber: string;

  @IsOptional()
  @IsInt()
  shelfId?: number | null;

  @IsBoolean()
  scheduled: boolean;

  @IsOptional()
  @IsInt()
  confirmedById?: number;

  @IsOptional()
  @IsInt()
  completedById?: number;

  @IsOptional()
  @IsDateString()
  scheduledDeliveryDate?: Date;

  @IsOptional()
  @IsDateString()
  scheduledDeliveryTime?: Date;

  @IsBoolean()
  isHidden: boolean;

  @IsInt()
  orderTypeId: number;
}

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

export class ProcessOrderDto {
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


export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
