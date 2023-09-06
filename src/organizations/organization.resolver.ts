import { Resolver, Query, Args } from '@nestjs/graphql';
import { GithubUserOrganizationService } from './organization.service';
import { GitHubUserOrganization } from './organization.schema';


@Resolver()
export class GithubUserOrganizationResolver {
    constructor(private readonly githubUserOrganizationService: GithubUserOrganizationService) {}

    @Query(returns => [GitHubUserOrganization])
    async githubUserOrganizations(@Args('username') username: string): Promise<GitHubUserOrganization[]> {
        return this.githubUserOrganizationService.getUserOrganization(username);
    }
    @Query(returns => String, { nullable: true })
    async getOrganizationMongoId(@Args('organizationId') organizationId: string): Promise<string | null> {
        return this.githubUserOrganizationService.getOrganizationMongoId(organizationId);
    }

  @Query(() => [String])
  async getOrganizationIdsByUsername(@Args('username') username: string): Promise<string[]> {
    try {
      const organizationIds = await this.githubUserOrganizationService.getOrganizationIdsByUsername(username);
      return organizationIds;
    } catch (error) {
      console.error('Error fetching organization IDs:', error);
      throw new Error('Error fetching organization IDs');
    }


  }
  @Query(() => GitHubUserOrganization, { nullable: true })
  async organizationByOrgName(@Args('orgName') orgName: string): Promise<GitHubUserOrganization | null> {
    return this.githubUserOrganizationService.findOrganizationByOrgName(orgName);
  }

}