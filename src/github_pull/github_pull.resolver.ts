import { Resolver, Query, Args, Subscription, Mutation } from "@nestjs/graphql";
import { GitHubPull } from "./github_pull.schema";
import { GithubPullService } from "./github_pull.service";


@Resolver(() => GitHubPull)
export class GithubPullResolver {
  constructor(private readonly githubPullService: GithubPullService) { }

  @Mutation(() => [GitHubPull])
  async createPullRequests(
    @Args("username") username: string,
    @Args("repo_name") repoName: string
  ): Promise<GitHubPull[]> {
    const pullRequests = await this.githubPullService.createPullRequests(username, repoName);

    return pullRequests;
  }

  @Query(() => [GitHubPull])
  async getPullRequestFromDb(@Args("username") username: string): Promise<GitHubPull[] | null> {
    return this.githubPullService.getPullRequestFromDb(username);
  }

  @Query(() => [GitHubPull])
  async searchPullRequests(
    @Args('username') username: string,
    @Args('searchKeyword') searchKeyword: string,
  ): Promise<GitHubPull[]> {
    return this.githubPullService.getFilteredPullRequests(username, searchKeyword);
  }

  @Query(() => GitHubPull)
  async getCommitsForPullRequest(
    @Args('username') username: string,
    @Args('url') url: string,
    @Args('repo_name') repo_name: string,
  ): Promise<GitHubPull> {
    return this.githubPullService.getCommitsForPullRequest(username, url, repo_name);
  }
  
}
