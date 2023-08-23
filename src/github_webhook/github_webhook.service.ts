import { Injectable } from '@nestjs/common';
import { GithubWebhook } from './github_webhook.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { GithubLoginService } from "../github_login/github_login.service";
import { GithubRepositoryService } from "src/github_repository/github_repository.service";

@Injectable()
export class GithubWebhookService {
    constructor(
        @InjectModel(GithubWebhook.name) private GithubWebhookModel: Model<GithubWebhook>,
        private readonly githubLoginService: GithubLoginService,
        private readonly githubRepositoryService: GithubRepositoryService,
    ) { }

    async handlePullRequestEvent(eventPayload: any) {
        const filter = { number: eventPayload.number, repo_name: eventPayload.repository.name };
        const data = eventPayload;
        const username = eventPayload.repository.owner.login;
        const repo_name = eventPayload.repository.name;
        const repo = await this.githubRepositoryService.getRepoIdByName(repo_name);
        const user = await this.githubLoginService.getGithubUserDetails(username);

        const existingWebhook = await this.GithubWebhookModel.findOne(filter);

        if (existingWebhook) {
            await this.GithubWebhookModel.findOneAndUpdate(filter, {
                github_weebhook_metadata: data,
                title: data.title,
                url: data.url,
                createdAt: data.created_at,
                mergedAt: data.merged_at,
                closedAt: data.closed_at,
                updatedAt: data.updated_at,
                repo_id: repo._id,
                user_id: user._id,
                repo_owner: username,
                repo_name: repo_name,
                state: data.state,
                number: data.number,
                id: data.id,
            });
            console.log('Updated pull request event:', existingWebhook);
        } else {
            const newGithubWebhook = new this.GithubWebhookModel({
                github_weebhook_metadata: data,
                title: data.title,
                url: data.url,
                createdAt: data.created_at,
                mergedAt: data.merged_at,
                closedAt: data.closed_at,
                updatedAt: data.updated_at,
                repo_id: repo._id,
                user_id: user._id,
                repo_owner: username,
                repo_name: repo_name,
                state: data.state,
                number: data.number,
                id: data.id,
            });
            await newGithubWebhook.save();
            console.log('Inserted pull request event:', newGithubWebhook);
        }
    }
}
