import { Module } from '@nestjs/common';
import { IsoDateResolver } from './isoDate.resolver';
import { IsoDateService } from './isoDate.service';

@Module({
  providers: [IsoDateResolver, IsoDateService],
  exports: [IsoDateService],
})
export class IsoDateModule {}
