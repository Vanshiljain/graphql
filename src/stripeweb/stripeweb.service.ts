
import { Injectable, NotFoundException, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StripeWebhookEventDto } from './webhook-event.dto';
import { StripeInvoice } from './stripe-invoice.schema';
import { StripeSubscription } from './strpe-subscription.schema';
import Stripe from 'stripe';
import { Response } from 'express';
import { PubSub } from 'graphql-subscriptions';
import { Subscription } from '@nestjs/graphql';
import { PaymentIntent } from './paymentintentmodel';
import { GithubLoginService } from '../githubUser/githubUser.service';

const pubSub = new PubSub(); 
const INVOICE_CREATED = 'invoiceCreated';
@Injectable()
export class WebhooksService {
  private stripe: Stripe;
  private sessionType: string = ''; 
  
 
  constructor(
    @InjectModel('StripeSubscription') private readonly stripeSubscriptionModel: Model<StripeSubscription>,
    @InjectModel('StripeInvoice') private readonly stripeInvoiceModel: Model<StripeInvoice>,
    @InjectModel('paymentIntent') private readonly paymentModel: Model<PaymentIntent>,
    public readonly githubLoginService: GithubLoginService,
  
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-08-16', 
    });

    console.log("stripekey------",process.env.STRIPE_SECRET_KEY)
  }
  async processStripeWebhook(payload: StripeWebhookEventDto) {
    const userIdDetails = await this.githubLoginService.getGithubUserDetails("Vanshiljain");
    const response: any = {};
 

    if (payload.type === 'checkout.session.completed') {
      const session = payload.data.object;
      const session_id = session.id;
      this.sessionType = session.metadata.type;

      if (this.sessionType === 'recurring') {
        const subscriptionData = new this.stripeSubscriptionModel({
          userId: userIdDetails,
          subscriptionId: session.subscription,
          metadata: payload,
          product: {
            product_id: session.metadata.product_id,
            product_metadata: JSON.parse(session.metadata.product_metadata),
          },
        });

        await subscriptionData.save();
        // response.checkoutSessionCompleted = { message: 'Webhook checkout.session.completed processed successfully.' };

      }
    }
  
    if (payload.type === 'invoice.paid' && this.sessionType === 'recurring') {
      const invoice = payload.data.object;
      
      
      const invoiceData = new this.stripeInvoiceModel({
        invoiceId: invoice.id,
        customerId: invoice.customer,
        customerName:invoice.customer_name,
        userId: userIdDetails,
        status: invoice.status,
        metadata: payload,
        plan :this.sessionType,
        eventType: 'invoice.payment_succeeded',
        invoice_pdf: invoice.invoice_pdf,
        subscriptionId: invoice.subscription,
        product: {
          product_id: invoice.lines.data[0].price.product,
        },
      });
     console.log("invoicepdf---->",invoice.invoice_pdf)
      await invoiceData.save();
        if (invoiceData) {
          const data = this.fetchInvoices();
          if(data){
          await pubSub.publish('invoiceCreated', { invoiceCreated: data });
    }}
      // response.invoicePaid = { message: 'Webhook invoice.paid processed successfully.' };
    }
    
    if (payload.type === 'payment_intent.succeeded' && this.sessionType === 'onetime') {
      const paymentIntentId = payload.data.object.id;
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);

      const invoiceId = paymentIntent.invoice;
      const invoice = await this.stripe.invoices.retrieve(invoiceId as string)
      const invoiceData = new this.stripeInvoiceModel({
        invoiceId: invoiceId,
        customerId: paymentIntent.customer,
        customerName:invoice.customer_name,
        userId: userIdDetails,
        status: invoice.status,
        invoice_pdf:invoice.invoice_pdf,
        plan :this.sessionType,
        metadata: paymentIntent,
        eventType: 'payment_intent.succeeded',
      });
  console.log("paymentintentdata------->",invoiceData)
      await invoiceData.save();
      if (invoiceData) {
        const data = this.fetchInvoices();
        if(data){
          await  pubSub.publish('invoiceCreated',{invoiceCreated:data});
        }
    }
     
    }
 

    
  }
  async recurringplan(productId: string, couponCode: string): Promise<string> {
    const product = await this. stripe.products.retrieve(productId);
    const prices = await  this.stripe.prices.list({ product: productId });
    const selectedPrice = prices.data[0];
  
    try {
      const { id: productId, name: productName, metadata: productMetadata, default_price: price } = product;
  
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        phone_number_collection: {
          enabled: true,
        },
        line_items: [
          {
            price: selectedPrice.id,
            quantity: 1,
          },
        ],
        metadata: {
          product_id: productId,
          productName: productName,
          product_metadata: JSON.stringify(productMetadata),
          type: 'recurring',
          // Add the user's email for receipt.
        },
        mode: 'subscription',
        allow_promotion_codes: true,
        success_url: 'http://localhost:5173/product-list',
        cancel_url: 'http://your-website.com/cancel',
       
        discounts: [
          {
            coupon: couponCode,
          },
        ],
      });
  
      console.log("product metadata-------->", session.metadata);
      return session.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }
  
async onetimeplan(productId: string): Promise<string> {
  const product = await this.stripe.products.retrieve(productId);
  const prices = await this.stripe.prices.list({ product: productId });
  const selectedPrice = prices.data[0];

  try {
    const { id: productId, name: productName, metadata: productMetadata } = product;

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: selectedPrice.id,
          quantity: 1,
        },
      ],
      metadata: {
        product_id: productId,
        productName: productName,
        product_metadata: JSON.stringify(productMetadata),
        type: 'onetime',
      },
      invoice_creation: { enabled: true },
      mode: 'payment',
      allow_promotion_codes: true,
      success_url: 'http://localhost:5173/one-time',
      cancel_url: 'http://localhost:5173/login',
    });


    return session.url;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}


@Subscription(() => [StripeInvoice], {
  resolve: (value) => value.invoiceCreated,
})
invoiceCreated() {
  return pubSub.asyncIterator(INVOICE_CREATED);
}
async fetchInvoices() {
  try {
    const invoices = await this.stripeInvoiceModel.find().sort({ createdAt: -1 }).limit(20);
    return invoices;
  
  } catch (error) {
    throw new NotFoundException('Invoices not found');
  }
}
}