// github_pull.resolver.ts
import { Resolver, Query, Args } from "@nestjs/graphql";
import { GitHubPull } from "./github_pull.schema";
import { GithubPullService } from "./github_pull.service";

@Resolver(() => GitHubPull)
export class GithubPullResolver {
    constructor(private readonly githubPullService: GithubPullService) {}

    @Query(() => [GitHubPull])
    async getPullRequests(
        @Args("username") username: string,
        @Args("repo_name") repoName: string,
        @Args("username_for_repo") username_for_repo: string
    ): Promise<GitHubPull[]> {
        return this.githubPullService.getPullRequests(username, repoName, username_for_repo);
    }
}
