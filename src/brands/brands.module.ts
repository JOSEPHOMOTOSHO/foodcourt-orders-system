import { Module } from '@nestjs/common';
import { BrandService } from './brands.service';
import { BrandController } from './brands.controller';

@Module({
  providers: [BrandService],
  controllers: [BrandController]
})
export class BrandsModule {}
