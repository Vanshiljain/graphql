import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GitHubWorkflowJob, GitHubWorkflowRun } from './github_workflow.schema';
import { GithubLoginService } from 'src/github_login/github_login.service';
import { GithubRepositoryService } from 'src/github_repository/github_repository.service';
import { PubSub } from 'graphql-subscriptions';
import { Subscription } from "@nestjs/graphql";

const pubSub = new PubSub();
const NEW_WORKFLOW_JOB_EVENT = 'newWorkflowJob';
const NEW_WORKFLOW_RUN_EVENT = 'newWorkflowRun';


@Injectable()
export class GithubWorkflowService {
    constructor(
        @InjectModel(GitHubWorkflowJob.name) private GithubWorkflowJobModel: Model<GitHubWorkflowJob>,
        @InjectModel(GitHubWorkflowRun.name) private GithubWorkflowRunModel: Model<GitHubWorkflowRun>,
        private readonly githubLoginService: GithubLoginService,
        private readonly githubRepositoryService: GithubRepositoryService
    ) {}

    async CreateJob(eventPayload): Promise<GitHubWorkflowJob> {
        const jobId = eventPayload.workflow_job.id;
        const repo = await this.githubRepositoryService.getRepoIdByName(eventPayload.repository.name);
        const user = await this.githubLoginService.getGithubUserDetails(eventPayload.sender.login);


        const filter = { id: jobId };
        const update = {
            $set: {
                id: jobId,
                repo_name: eventPayload.repository.name,
                repo_owner: eventPayload.repository.owner.login,
                repo_id: repo._id,
                user_id:user._id,
                name: eventPayload.workflow_job.name,
                GitHubWorkflowJob: eventPayload,
                url: eventPayload.workflow_job.url,
                createdAt: eventPayload.workflow_job.created_at,
                Status: eventPayload.workflow_job.status,
                title: eventPayload.workflow_job.name,
            },
        };
        const options = { upsert: true, new: true };

        const updatedJob = await this.GithubWorkflowJobModel.findOneAndUpdate(filter, update, options);
        if (updatedJob) {
            const data = await this.getWorkflowJobFromDb(eventPayload.sender.login);
            if (data) {
                await pubSub.publish(NEW_WORKFLOW_JOB_EVENT, { newWorkflowJob: data });
            }
        }

        console.log('Updated or created job:', updatedJob);
        return updatedJob;
    }

    async CreateRun(eventPayload): Promise<GitHubWorkflowRun> {
        const runId = eventPayload.workflow_run.id;
        const repo = await this.githubRepositoryService.getRepoIdByName(eventPayload.repository.name);
        const user = await this.githubLoginService.getGithubUserDetails(eventPayload.sender.login);


        const filter = { id: runId };
        const update = {
            $set: {
                id: runId,
                repo_name: eventPayload.repository.name,
                repo_owner: eventPayload.repository.owner.login,
                repo_id: repo._id,
                user_id:user._id,
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


    async getWorkflowJobFromDb(username: string): Promise<any> {
        const user = await this.githubLoginService.getGithubUserDetails(username);
        return this.GithubWorkflowJobModel.find({ user_id: user._id }).sort({ createdAt: -1 }).limit(5);
    }

    async getWorkflowRunFromDb(username: string): Promise<any> {
        const user = await this.githubLoginService.getGithubUserDetails(username);
        return this.GithubWorkflowRunModel.find({ user_id: user._id }).sort({ createdAt: -1 }).limit(5);
    }
}
