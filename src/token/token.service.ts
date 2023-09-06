import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token, TokenInput } from './token.schema';

@Injectable()
export class TokenService {
    constructor(@InjectModel(Token.name) private readonly tokenModel: Model<Token>) {}
  
    async createToken(tokenInput: TokenInput): Promise<Token> {
      const token = new this.tokenModel({ ...tokenInput });
      const savedToken = await token.save();
  
      return savedToken;
    }
  }
