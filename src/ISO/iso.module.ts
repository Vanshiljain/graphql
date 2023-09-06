import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IsoResolver } from './iso.resolver';
import { IsoService } from './iso.service';

@Module({
  
  providers: [IsoService,IsoResolver],
  exports: [IsoResolver]
})
export class IsoModule {}
