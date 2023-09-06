import { Module } from '@nestjs/common';
import { WebhooksService } from './stripeweb.service';
import { WebhooksController } from './stripeweb.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PubSub } from 'graphql-subscriptions';
import { StripeInvoiceSchema } from './stripe-invoice.schema'; // Import the new schema
import { StripeSubscriptionSchema } from './strpe-subscription.schema';
import { GithubLoginModule } from 'src/githubUser/githubUser.module';
import { CreateCheckoutSession, CreateCheckoutSessionSchema } from 'src/githubUser/checkoutsessioninput.dto';
import { stripewebResolver } from './stripeweb.resolver';
import { PaymentIntentSchema } from './paymentintentmodel';

@Module({
  imports: [
    MongooseModule.forFeature([
   
      { name: 'StripeSubscription', schema: StripeSubscriptionSchema }, // Include the new schema
      { name: 'StripeInvoice', schema: StripeInvoiceSchema },
      { name: 'paymentIntent', schema: PaymentIntentSchema },
      
     { name: CreateCheckoutSession.name, schema: CreateCheckoutSessionSchema },
    
  ]),
  GithubLoginModule
],
  providers: [WebhooksService,stripewebResolver,PubSub, {
    provide: 'PUB_SUB', 
    useClass: PubSub, 
  },],
  controllers: [WebhooksController],
})
export class StripewebModule {}
