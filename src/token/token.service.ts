import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token, TokenInput } from './token.schema';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TokenService {
    constructor(@InjectModel('Token') private readonly tokenModel: Model<Token>
    ) { }f

    @Cron(CronExpression.EVERY_MINUTE)
    async deleteExpiredTokens() {
        const Minute = new Date();
        await this.tokenModel.deleteOne({ createdAt: { $lt: Minute } });
    }

    async createToken(tokenInput: TokenInput): Promise<Token> {
        const aggregation = new this.tokenModel({ ...tokenInput });
        return aggregation.save();
    }
}