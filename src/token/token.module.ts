import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenResolver } from './token.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Token } from 'graphql';
import { TokenSchema } from './token.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),],
  providers: [TokenService, TokenResolver],
  exports: [TokenService],
})
export class TokenModule {}
