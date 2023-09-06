import { Controller, Post, Body } from '@nestjs/common';

@Controller('stripe')
export class StripeController {
    constructor() {}

    @Post()
    handleStripeWebhook(@Body() payload: any) {
        console.log('Received Stripe Webhook:', payload);
    }
}
