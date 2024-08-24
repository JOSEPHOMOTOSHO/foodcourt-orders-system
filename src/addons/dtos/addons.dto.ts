import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateAddonDto {

  @IsNumber()
  @IsOptional()
  mealId: number;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsNumber()
  internalProfit?: number;

  @IsNotEmpty()
  @IsNumber()
  minSelectionNo: number;
}

export class UpdateAddonDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsOptional()
  mealId?: number;
}
