import { Resolver, Query, Args, Subscription, Mutation } from "@nestjs/graphql";
import { GitHubPull } from "./github_pull.schema";
import { GithubPullService } from "./github_pull.service";
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();
const NEW_PULL_REQUEST_EVENT = 'newPullRequest';

@Resolver(() => GitHubPull)
export class GithubPullResolver {
  constructor(private readonly githubPullService: GithubPullService) { }

  @Mutation(() => [GitHubPull])
  async createPullRequests(
    @Args("username") username: string,
    @Args("repo_name") repoName: string
  ): Promise<GitHubPull[]> {
    const pullRequests = await this.githubPullService.createPullRequests(username, repoName);
    const updatedPullRequests = await this.githubPullService.getPullRequestFromDb(username);
    await pubSub.publish(NEW_PULL_REQUEST_EVENT, { newPullRequest: updatedPullRequests });

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

  @Subscription(() => [GitHubPull], {
    resolve: (value) => value.newPullRequest,
  })
  newPullRequest() {
    return pubSub.asyncIterator(NEW_PULL_REQUEST_EVENT);
  }
}
