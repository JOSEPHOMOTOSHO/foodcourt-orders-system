import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { BrandService } from './brands.service';
import { CreateBrandDto, UpdateBrandDto } from './dtos/brands.dto';

@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  createBrand(@Body() createBrandDto: CreateBrandDto) {
    return this.brandService.createBrand(createBrandDto);
  }

  @Get(':id')
  getBrandById(@Param('id') id: number) {
    console.log(id)
    return this.brandService.getBrandById(id);
  }

  @Put(':id')
  updateBrand(@Param('id') id: number, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandService.updateBrand(id, updateBrandDto);
  }

  @Delete(':id')
  deleteBrand(@Param('id') id: number) {
    return this.brandService.deleteBrand(id);
  }

  @Get()
  getAllBrands(@Query('page') page: number, @Query('limit') limit: number) {
    return this.brandService.getAllBrands(page, limit);
  }
}
