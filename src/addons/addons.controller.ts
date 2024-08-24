import { Controller, Get, Post, Put, Delete, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { AddonService } from './addons.service';
import { CreateAddonDto, UpdateAddonDto } from './dtos/addons.dto';

@Controller('meals/:mealId/addons')
export class AddonController {
  constructor(private readonly addonService: AddonService) {}

  @Post()
  createAddon( @Param('mealId', ParseIntPipe) mealId: number, @Body() createAddonDto: CreateAddonDto) {
    return this.addonService.createAddon(mealId, createAddonDto);
  }

  @Get(':id')
  getAddonById(@Param('mealId', ParseIntPipe) mealId: number, @Param('id', ParseIntPipe) id: number,) {
    return this.addonService.getAddonById(mealId, id);
  }

  @Put(':id')
  updateAddon(@Param('mealId', ParseIntPipe) mealId: number, @Param('id', ParseIntPipe) id: number, @Body() updateAddonDto: UpdateAddonDto) {
    return this.addonService.updateAddon(mealId, id, updateAddonDto);
  }

  @Delete(':id')
  deleteAddon(@Param('mealId', ParseIntPipe) mealId: number, @Param('id', ParseIntPipe) id: number,) {
    return this.addonService.deleteAddon(mealId, id);
  }

  @Get()
  getAllAddons(@Query('mealId') mealId: number) {
    return this.addonService.getAllAddons(mealId);
  }
}
