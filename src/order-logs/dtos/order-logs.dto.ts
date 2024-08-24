import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrderLogDto {

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDate()
  time: Date;
}

export class UpdateOrderLogDto {
  @IsString()
  @IsNotEmpty()
  description: string;
}
