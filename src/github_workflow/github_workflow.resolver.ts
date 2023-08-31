import { Resolver, Query, Args } from '@nestjs/graphql';
import { GithubWorkflowService } from './github_workflow.service';
import { GitHubWorkflowJob, GitHubWorkflowRun } from './github_workflow.schema';

@Resolver()
export class GithubWorkflowResolver {
    constructor(
        private readonly githubWorkflowService: GithubWorkflowService
    ) {}

    @Query(returns => [GitHubWorkflowJob])
    async getWorkflowJobFromDb(@Args('userName') userName: string): Promise<GitHubWorkflowJob[]> {
        return this.githubWorkflowService.getWorkflowJobFromDb(userName);
    }

    @Query(returns => [GitHubWorkflowRun])
    async getWorkflowRunFromDb(@Args('userName') userName: string): Promise<GitHubWorkflowRun[]> {
        return this.githubWorkflowService.getWorkflowRunFromDb(userName);
    }
}
