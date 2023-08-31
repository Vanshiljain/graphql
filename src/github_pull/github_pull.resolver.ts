import { Resolver, Query, Args, Subscription, Mutation } from "@nestjs/graphql";
import { GitHubPull } from "./github_pull.schema";
import { GithubPullService } from "./github_pull.service";

@Resolver(() => GitHubPull)
export class GithubPullResolver {
  constructor(private readonly githubPullService: GithubPullService) { }
  @Mutation(() => [GitHubPull])
  async createPullRequests(@Args("userName") userName: string, @Args("repoName") repoName: string): Promise<GitHubPull[]> {
    const pullRequests = await this.githubPullService.createPullRequests(userName, repoName);
    return pullRequests;
  }

  @Query(() => [GitHubPull])
  async getPullRequestFromDb(@Args("userName") userName: string): Promise<GitHubPull[] | null> {
    return this.githubPullService.getPullRequestFromDb(userName);
  }

  @Query(() => [GitHubPull])
  async searchPullRequests(@Args('userName') userName: string, @Args('searchKeyword') searchKeyword: string): Promise<GitHubPull[]> {
    return this.githubPullService.getFilteredPullRequests(userName, searchKeyword);
  }

  @Query(() => GitHubPull)
  async getCommitsForPullRequest(@Args('userName') userName: string, @Args('url') url: string, @Args('repoName') repoName: string): Promise<GitHubPull> {
    return this.githubPullService.getCommitsForPullRequest(userName, url, repoName);
  }
}
