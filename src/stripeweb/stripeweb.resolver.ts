import { Resolver, Query,Mutation, Args } from '@nestjs/graphql';
import { GithubLoginService } from 'src/githubUser/githubUser.service';
import { WebhooksService } from './stripeweb.service';
import { StripeInvoice } from './stripe-invoice.schema';

@Resolver()
export class stripewebResolver {
  constructor(private readonly GithubLoginService: GithubLoginService,
    private readonly webhooksService: WebhooksService,
    
    ) { }

    @Mutation(() => String)
    async recurringplan(@Args('productId') productId: string): Promise<string> {
      try {
        const sessionUrl = await this.webhooksService.recurringplan(productId);
        return sessionUrl;
      } catch (error) {
       
        throw new Error('Failed to create Stripe session');
      }
    }
 
  @Mutation(() => String)
  async onetimeplan(@Args('productId') productId: string): Promise<string> {
    try {
        const sessionUrl = await this.webhooksService.onetimeplan(productId);
        return sessionUrl;
    } catch (error) {
        console.error('Failed to create Stripe session:', error);
        throw new Error('Failed to create Stripe session');
    }

 
  }
  @Query(() => [StripeInvoice])
  async fetchInvoices(): Promise<StripeInvoice[]> {
    try {
      const invoices = await this.webhooksService.fetchInvoices();
      return invoices;
    } catch (error) {
    
      throw new Error('Failed to fetch invoices');
    }
  }
  



}
  
  
  
  
  