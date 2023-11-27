
import { Controller, Post, Req, Res, Headers ,Body} from '@nestjs/common';
import { Response } from 'express';
import { WebhookEventService } from './webhook.event.service';

@Controller()
export class WebhookController {
  constructor(private readonly webhookService: WebhookEventService) {}

  @Post('github')
  @Post('webhooks')
  async handleWebhook(@Body() payload: any, @Headers('x-hub-signature-256') signature: string, @Req() req: Request, @Res() res: Response): Promise<void> {
    await this.webhookService.handleWebhookEvent(payload, signature, req, res);
}

}

