import { Module } from '@nestjs/common';
import { IsoDateResolver } from './iso_date.resolver';
import { IsoDateService } from './iso_date.service';

@Module({
  providers: [IsoDateResolver, IsoDateService],
  exports: [IsoDateService],
})
export class IsoDateModule {}
