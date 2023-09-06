// // src/webhook/webhook.resolver.ts
// import { Resolver, Query, Args, Int } from '@nestjs/graphql';
// import { WebhookEvent } from './webhook.dto';
// import { WebhookEventService } from './webhook.event.service';


// @Resolver(() => WebhookEvent)
// export class WebhookResolver {
//   constructor(private readonly webhookEventService: WebhookEventService) {}

//   @Query(() => [WebhookEvent])
//   async webhookEvents(@Args('limit', { type: () => Int, defaultValue: 10 }) limit: number) {
//     // Fetch the latest 'limit' number of events
//     return this.webhookEventService.getLatestEvents(limit);
//   }
// }
