import { Module } from '@nestjs/common';
import { IsoDateResolver } from './iso-date.resolver';
import { IsoDateService } from './iso-date.service';

@Module({
  providers: [IsoDateResolver, IsoDateService],
  exports: [IsoDateService],
})
export class IsoDateModule {}
