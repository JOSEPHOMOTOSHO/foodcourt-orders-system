import { Injectable, NotFoundException, Inject, BadRequestException } from '@nestjs/common';
// import { InjectModel } from '@willsoto/nestjs-objection';
import { CreateBrandDto, UpdateBrandDto } from './dtos/brands.dto';
import { Brand } from '../database/models/brands.model';
import { isNameUnique } from 'src/util/isUnique.validations';
import { Page } from 'objection';

@Injectable()
export class BrandService {

  async createBrand(createBrandDto: CreateBrandDto): Promise<Brand> {
    if (!(await isNameUnique(Brand, createBrandDto.name))) {
      throw new BadRequestException('Brand name already exists');
    }
    return Brand.query().insert(createBrandDto);
  }

  async getBrandById(id: number): Promise<Brand> {
    const brand = await Brand.query().findById(id);
    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }
    return brand;
  }

  async updateBrand(id: number, updateBrandDto: UpdateBrandDto): Promise<Brand> {
    const brand = await Brand.query().findById(id);
    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    if (
      updateBrandDto.name &&
      !(await isNameUnique(Brand, updateBrandDto.name, id))
    ) {
      throw new BadRequestException('Brand name already exists');
    }

    return Brand.query().patchAndFetchById(id, updateBrandDto);
  }

  async deleteBrand(id: number): Promise<void> {
    const rowsDeleted = await Brand.query().deleteById(id);
    if (!rowsDeleted) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }
  }

  async getAllBrands(page: number, limit: number): Promise<Page<Brand>> {
    return Brand.query().page(page, limit);
  }
}
