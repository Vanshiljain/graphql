// date/date.resolver.ts

import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { IsoService } from './iso.service';

@Resolver()
export class IsoResolver {
  constructor(private readonly isoService: IsoService) {}

  @Mutation(() => String)
  checkDateAge(@Args('Date') isoDate: string): string {
    return this.isoService.checkDateAge(isoDate);
  }
}
