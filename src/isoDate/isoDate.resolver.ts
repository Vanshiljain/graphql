import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { IsoDateService } from './isoDate.service';

@Resolver()
export class IsoDateResolver {
    constructor(private readonly isoDateService: IsoDateService) {  }

    @Mutation(() => String)
    async checkDate(@Args('date') date: string): Promise<String> {
        return this.isoDateService.checkDate(date);
    }
}
