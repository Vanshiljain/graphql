import { Injectable } from '@nestjs/common';
import { GithubWebhook } from './githubWebhook.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { GithubLoginService } from "../githubLogin/githubLogin.service";
import { GithubRepositoryService } from "src/githubRepository/githubRepository.service";
import { GithubPullService } from 'src/githubPull/githubPull.service';
import { GithubWorkflowService } from 'src/githubWorkflow/githubWorkflow.service';

@Injectable()
export class GithubWebhookService {
    constructor(
        @InjectModel(GithubWebhook.name) private GithubWebhookModel: Model<GithubWebhook>,
        private readonly githubLoginService: GithubLoginService,
        private readonly githubRepositoryService: GithubRepositoryService,
        private readonly createPullRequestsService: GithubPullService,
        private readonly GithubWorkflowService: GithubWorkflowService,
    ) { }

    async handlePullRequestEvent(eventPayload: any) {
        const filter = { number: eventPayload.number, repoName: eventPayload.repository.name };
        const data = eventPayload;
        const userName = eventPayload.pull_request.user.login;
        const repoName = eventPayload.repository.name;
        const repo = await this.githubRepositoryService.getRepoIdByName(repoName);
        const user = await this.githubLoginService.getGithubUserDetails(userName);
        const existingWebhook = await this.GithubWebhookModel.findOne(filter);
        this.createPullRequestsService.createPullRequests(userName, repoName);
        if (existingWebhook) {
            await this.GithubWebhookModel.findOneAndUpdate(filter, {
                githubWebhookMetadata: data,
                title: data.title,
                url: data.url,
                createdAt: data.created_at,
                mergedAt: data.merged_at,
                closedAt: data.closed_at,
                updatedAt: data.updated_at,
                repoId: repo._id,
                userId: user._id,
                repoOwner: userName,
                repoName: repoName,
                state: data.state,
                number: data.number,
                id: data.id,
                repositoryType: data.repository.owner.type,
            });
            console.log('Updated pull request event:', existingWebhook);
        } else {
            const newGithubWebhook = new this.GithubWebhookModel({
                githubWebhookMetadata: data,
                title: data.title,
                url: data.url,
                createdAt: data.created_at,
                mergedAt: data.merged_at,
                closedAt: data.closed_at,
                updatedAt: data.updated_at,
                repoId: repo._id,
                userId: user._id,
                repoOwner: userName,
                repoName: repoName,
                state: data.state,
                number: data.number,
                id: data.id,
            });
            await newGithubWebhook.save();
            console.log('Inserted pull request event:', newGithubWebhook);
        }
    }

    async handlePushEvent(eventPayload: any, eventType: string) {
        const userName = eventPayload.repository.owner.login;
        const repoName = eventPayload.repository.name;
        const pull = await this.createPullRequestsService.createPullRequests(userName, repoName);
        if (pull) {
            const commitData = await this.createPullRequestsService.getCommitsForPullRequest(userName, eventPayload.commits[0].url, repoName);
        }
        else {
            console.log('No pull request found');
        }
    }

    async handleWorkflowRunEvent(eventPayload: any) {
        this.GithubWorkflowService.CreateRun(eventPayload);
    }

    async handleWorkflowJobEvent(eventPayload: any) {
        this.GithubWorkflowService.CreateJob(eventPayload);
    }
}
