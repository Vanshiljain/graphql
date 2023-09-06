import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeResolver } from './stripe.resolver';
import { StripeController } from './stripe.controller';

@Module({
  providers: [StripeService, StripeResolver],
  controllers: [StripeController]
})
export class StripeModule { }
