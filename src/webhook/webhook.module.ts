
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { WebhookController } from './webhook.controller';
import { WebhookEventService } from './webhook.event.service';

import { GithubUserOrganizationModule } from 'src/organizations/organization.module';
import { AppWebhook, gitHubAppWebhookSchema } from './webhook.dto';
import { GitHubUserDetails } from 'src/githubUser/github.schema';
import { GithubLoginModule } from 'src/githubUser/githubUser.module';
import { GitHubUserOrganizationSchema } from 'src/organizations/organization.schema';

// import { AppWebhook, gitHubAppWebhookSchema } from './webhook.dto';

// import { GitHubAppWebhook, OrganizationAppWebhook, gitHubAppWebhookSchema, organizationAppWebhookSchema } from './webhook.dto';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AppWebhook.name, schema: gitHubAppWebhookSchema },
    ]),
    MongooseModule.forFeature([
      { name: 'GitHubUserOrganization', schema: GitHubUserOrganizationSchema },
    ]),
    GithubUserOrganizationModule,
    GithubLoginModule,
    GithubUserOrganizationModule
  ],
  controllers: [WebhookController,],
  providers: [WebhookEventService,],
})
export class WebhookModule {}
