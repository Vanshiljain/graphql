import { Resolver, Query, Args } from '@nestjs/graphql';
import { GithubWorkflowService } from './github_workflow.service';
import { GitHubWorkflowJob, GitHubWorkflowRun } from './github_workflow.schema';

@Resolver()
export class GithubWorkflowResolver {
    constructor(
        private readonly githubWorkflowService: GithubWorkflowService
    ) {}

    @Query(returns => [GitHubWorkflowJob])
    async getWorkflowJobFromDb(@Args('username') username: string): Promise<GitHubWorkflowJob[]> {
        return this.githubWorkflowService.getWorkflowJobFromDb(username);
    }

    @Query(returns => [GitHubWorkflowRun])
    async getWorkflowRunFromDb(@Args('username') username: string): Promise<GitHubWorkflowRun[]> {
        return this.githubWorkflowService.getWorkflowRunFromDb(username);
    }
}
