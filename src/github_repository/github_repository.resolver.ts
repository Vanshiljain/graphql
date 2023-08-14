import { Resolver, Args, Query } from '@nestjs/graphql';
import { GitHubRepository } from './github_repository.schema';
import { GithubRepositoryService } from './github_repository.service';

@Resolver(() => GitHubRepository)
export class GithubRepositoryResolver {
    constructor(
        private readonly githubRepositoryService: GithubRepositoryService,
    ) { }

    @Query(() => [GitHubRepository])
    async githubRepositories(@Args('username') username: string): Promise<GitHubRepository[]> {
        return this.githubRepositoryService.getUserRepositories(username);
    }

    @Query(() => [GitHubRepository])
    async githubOrganizationRepositories(@Args('username') username: string,@Args('org_name') org_name:string): Promise<GitHubRepository[]> {
        return this.githubRepositoryService.getOrganizationRepositories(username, org_name);
    }
}
