import { Resolver, Query, Args } from '@nestjs/graphql';
import { GitHubUserOrganization } from './github_user_organization.schema';
import { GithubUserOrganizationService } from './github_user_organization.service';

@Resolver()
export class GithubUserOrganizationResolver {
    constructor(private readonly githubUserOrganizationService: GithubUserOrganizationService) {}

    @Query(returns => [GitHubUserOrganization])
    async githubUserOrganizations(@Args('username') username: string): Promise<GitHubUserOrganization[]> {
        return this.githubUserOrganizationService.getUserOrganization(username);
    }
}
