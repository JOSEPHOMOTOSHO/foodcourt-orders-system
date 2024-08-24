import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateOrderTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateOrderTypeDto extends PartialType(CreateOrderTypeDto) {}
