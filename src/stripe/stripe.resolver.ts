import { Resolver } from '@nestjs/graphql';
import { Args, Mutation } from '@nestjs/graphql';
import { StripeService } from './stripe.service';

@Resolver()
export class StripeResolver {
    constructor(private stripeService: StripeService) { }

    @Mutation(() => String)
    async onetimeplan(@Args('productId') productId: string): Promise<string> {
        try {
            const sessionUrl = await this.stripeService.onetimeplan(productId);
            return sessionUrl;
        } catch (error) {
            console.error('Failed to create Stripe session:', error);
            throw new Error('Failed to create Stripe session');
        }
    }
}
