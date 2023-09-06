import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';


@Injectable()
export class StripeService {
    private stripe: Stripe;
    constructor() {
        this.stripe = new Stripe('sk_test_51NlTfRSC6eBuCJlad13u1ZHgndEIAiVewzpwEHIdcAv8x7MekBtQ9B1tJsxV1L6w11vGiZ2hHVwslm1OqTiqotGy00TD6DMgtk', {
            apiVersion: '2023-08-16',
        });
    }
    async onetimeplan(productId: string): Promise<string> {
        const product = await this.stripe.products.retrieve(productId);
        const prices = await this.stripe.prices.list({ product: productId });
        const selectedPrice = prices.data[0];
        try {

            const { id: productId, name: productName, metadata: productMetadata, default_price: price } = product;
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
                success_url: 'http://localhost:3001/stripe',
                // cancel_url: 'http://localhost:3001/cancel',
            });
            return session.url;
        } catch (error) {
            console.error('Error creating checkout session:', error);
            throw error;
        }
    }
}
