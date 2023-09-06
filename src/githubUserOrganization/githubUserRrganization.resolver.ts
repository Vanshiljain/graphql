import { Resolver, Query, Args } from '@nestjs/graphql';
import { GitHubUserOrganization } from './githubUserOrganization.schema';
import { GithubUserOrganizationService } from './githubUserOrganization.service';

@Resolver()
export class GithubUserOrganizationResolver {
    constructor(private readonly githubUserOrganizationService: GithubUserOrganizationService) {}

    @Query(returns => [GitHubUserOrganization])
    async githubUserOrganizations(@Args('userName') userName: string): Promise<GitHubUserOrganization[]> {
        return this.githubUserOrganizationService.getUserOrganization(userName);
    }
}
