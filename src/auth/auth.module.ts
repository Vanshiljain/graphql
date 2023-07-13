import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthController } from './auth.controller';

@Module({
  providers: [AuthResolver],
  controllers: [AuthController]
})
export class AuthModule {}
