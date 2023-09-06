import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GitHubWorkflowJob, GitHubWorkflowRun } from './githubWorkflow.schema';
import { GithubLoginService } from 'src/githubLogin/githubLogin.service';
import { GithubRepositoryService } from 'src/githubRepository/githubRepository.service';
import { PubSub } from 'graphql-subscriptions';
import { Subscription } from "@nestjs/graphql";
import { GithubUserOrganizationService } from 'src/githubUserOrganization/githubUserOrganization.service';

const pubSub = new PubSub();
const NEW_WORKFLOW_JOB_EVENT = 'newWorkflowJob';
const NEW_WORKFLOW_RUN_EVENT = 'newWorkflowRun';

@Injectable()
export class GithubWorkflowService {
    constructor(
        @InjectModel(GitHubWorkflowJob.name) private GithubWorkflowJobModel: Model<GitHubWorkflowJob>,
        @InjectModel(GitHubWorkflowRun.name) private GithubWorkflowRunModel: Model<GitHubWorkflowRun>,
        private readonly githubLoginService: GithubLoginService,
        private readonly githubRepositoryService: GithubRepositoryService,
        private readonly githubUserOrganizationService: GithubUserOrganizationService,
    ) { }

    async CreateJob(eventPayload): Promise<GitHubWorkflowJob> {
        const jobId = eventPayload.workflow_job.id;
        const repo = await this.githubRepositoryService.getRepoIdByName(eventPayload.repository.name);
        const user = await this.githubLoginService.getGithubUserDetails(eventPayload.sender.login);
        const payload = {
            id: jobId,
            repoName: eventPayload.repository.name,
            repoOwner: eventPayload.repository.owner.login,
            repoId: repo._id,
            userId: user._id,
            name: eventPayload.workflow_job.name,
            GitHubWorkflowJob: eventPayload,
            url: eventPayload.workflow_job.url,
            createdAt: eventPayload.workflow_job.created_at,
            Status: eventPayload.workflow_job.status,
            title: eventPayload.workflow_job.name,
        };
        if (eventPayload.sender.type === 'Organization') {
            const org = await this.githubUserOrganizationService.getOrganizationIdByName(eventPayload.sender.login);
            payload["orgId"] = org._id;
            payload["orgName"] = org.orgName;
        }
        const filter = { id: jobId };
        const update = { $set: payload };
        const options = { upsert: true, new: true };
        try {
            const updatedJob = await this.GithubWorkflowJobModel.findOneAndUpdate(filter, update, options);
            if (updatedJob) {
                const data = await this.getWorkflowJobFromDb(eventPayload.sender.login);
                if (data) {
                    await pubSub.publish(NEW_WORKFLOW_JOB_EVENT, { newWorkflowJob: data });
                }
            }
            console.log('Updated or created job:', updatedJob);
            return updatedJob;
        } catch (error) {
            console.error('Error creating or updating job:', error);
            throw new Error('Failed to create or update job.');
        }
    }

    async CreateRun(eventPayload): Promise<GitHubWorkflowRun> {
        const runId = eventPayload.workflow_run.id;
        const repo = await this.githubRepositoryService.getRepoIdByName(eventPayload.repository.name);
        const user = await this.githubLoginService.getGithubUserDetails(eventPayload.sender.login);
        const filter = { id: runId };
        const update = {
            $set: {
                id: runId,
                repoName: eventPayload.repository.name,
                repoOwner: eventPayload.repository.owner.login,
                repoId: repo._id,
                userId: user._id,
                name: eventPayload.workflow_run.name,
                GitHubWorkflowJob: eventPayload,
                url: eventPayload.workflow_run.url,
                createdAt: eventPayload.workflow_run.created_at,
                Status: eventPayload.workflow_run.status,
                title: eventPayload.workflow_run.name,
            },
        };
        const options = { upsert: true, new: true };
        const updatedRun = await this.GithubWorkflowRunModel.findOneAndUpdate(filter, update, options);
        console.log('Updated or created run:', updatedRun);
        if (updatedRun) {
            const data = await this.getWorkflowRunFromDb(eventPayload.sender.login);
            if (data) {
                await pubSub.publish(NEW_WORKFLOW_RUN_EVENT, { newWorkflowRun: data });
            }
        }
        return updatedRun;
    }

    @Subscription(() => [GitHubWorkflowJob], {
        resolve: (value) => value.newWorkflowJob,
    })
    newWorkflowJob() {
        return pubSub.asyncIterator(NEW_WORKFLOW_JOB_EVENT);
    }

    @Subscription(() => [GitHubWorkflowRun], {
        resolve: (value) => value.newWorkflowRun,
    })
    newWorkflowRun() {
        return pubSub.asyncIterator(NEW_WORKFLOW_RUN_EVENT);
    }

    async getWorkflowJobFromDb(userName: string): Promise<any> {
        const user = await this.githubLoginService.getGithubUserDetails(userName);
        return this.GithubWorkflowJobModel.find({ userId: user._id }).sort({ createdAt: -1 }).limit(10);
    }

    async getWorkflowRunFromDb(userName: string): Promise<any> {
        const user = await this.githubLoginService.getGithubUserDetails(userName);
        return this.GithubWorkflowRunModel.find({ userId: user._id }).sort({ createdAt: -1 }).limit(10);
    }
}
