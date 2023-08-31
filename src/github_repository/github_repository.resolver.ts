import { Resolver, Args, Query } from '@nestjs/graphql';
import { GitHubRepository } from './github_repository.schema';
import { GithubRepositoryService } from './github_repository.service';

@Resolver(() => GitHubRepository)
export class GithubRepositoryResolver {
    constructor(private readonly githubRepositoryService: GithubRepositoryService) { }

    @Query(() => [GitHubRepository])
    async githubRepositories(@Args('userName') userName: string): Promise<GitHubRepository[]> {
        return this.githubRepositoryService.getUserRepositories(userName);
    }

    @Query(() => [GitHubRepository])
    async githubOrganizationRepositories(@Args('userName') userName: string, @Args('orgName') orgName: string): Promise<GitHubRepository[]> {
        return this.githubRepositoryService.getOrganizationRepositories(userName, orgName);
    }
}
