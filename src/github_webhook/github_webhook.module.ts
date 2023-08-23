import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GithubWebhookController } from './github_webhook.controller';
import { GithubWebhookService } from './github_webhook.service';
import { GithubWebhook, GithubWebhookSchema } from './github_webhook.schema';
import { GithubRepositoryModule } from 'src/github_repository/github_repository.module';
import { GithubLoginModule } from 'src/github_login/github_login.module';
import { GithubPullModule } from 'src/github_pull/github_pull.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: GithubWebhook.name, schema: GithubWebhookSchema }]),
        GithubLoginModule, GithubRepositoryModule, GithubPullModule
    ],
    controllers: [GithubWebhookController],
    providers: [GithubWebhookService],
    exports: [GithubWebhookService]
})
export class GithubWebhookModule {}
