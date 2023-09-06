import { Controller, Post, Body,Get ,Res} from '@nestjs/common';
import { WebhooksService } from './stripeweb.service';
import { StripeWebhookEventDto } from './webhook-event.dto';
import { Response } from 'express'; 

@Controller('api')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

 
  @Post('stripe')
  handleStripeWebhook(@Body() payload: StripeWebhookEventDto,@Res() res: Response) {
    console.log('Received Stripe Webhook:', payload);
    this.webhooksService.processStripeWebhook(payload,res);
  }


  

}

