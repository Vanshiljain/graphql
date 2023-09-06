import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token, TokenInput } from './token.schema';

@Injectable()
export class TokenService {
<<<<<<< HEAD
    constructor(@InjectModel(Token.name) private readonly tokenModel: Model<Token>) {}
  
=======
    constructor(@InjectModel('Token') private readonly tokenModel: Model<Token>
    ) { }

>>>>>>> a0bf9a60f07ecabae155be9b3392a5b9c871e8c7
    async createToken(tokenInput: TokenInput): Promise<Token> {
      const token = new this.tokenModel({ ...tokenInput });
      const savedToken = await token.save();
  
      return savedToken;
    }
  }
