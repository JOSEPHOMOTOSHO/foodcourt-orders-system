import { Module } from '@nestjs/common';
import { AddonService } from './addons.service';
import { AddonController } from './addons.controller';

@Module({
  providers: [AddonService],
  controllers: [AddonController]
})
export class AddonsModule {}
