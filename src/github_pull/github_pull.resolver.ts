import { Resolver, Query, Args } from "@nestjs/graphql";
import { GitHubPull } from "./github_pull.schema";
import { GithubPullService } from "./github_pull.service";

@Resolver(() => GitHubPull)
export class GithubPullResolver {
    constructor(private readonly githubPullService: GithubPullService) { }

    @Query(() => [GitHubPull])
    async getPullRequests(
        @Args("username") username: string,
        @Args("repo_name") repoName: string
    ): Promise<GitHubPull[]> {
        return this.githubPullService.getPullRequests(username, repoName);
    }

    @Query(() => [GitHubPull])
    async getPullRequestFromDb(@Args("username") username: string): Promise<GitHubPull[] | null> {
        return this.githubPullService.getPullRequestFromDb(username);
    }
        
}
