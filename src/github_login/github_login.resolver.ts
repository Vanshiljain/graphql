import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { GithubLoginService } from './github_login.service';
import { GithubAuthResponse, AccessTokenResponse } from 'src/user/user.schema';
import { GitHubUserDetails } from './github_login.schema';

@Resolver()
export class GithubLoginResolver {
  constructor(private readonly GithubLoginService: GithubLoginService) { }

    @Mutation(() => GithubAuthResponse)
    async githubLogin(): Promise<{ githubAuthUrl: string }> {
      return await this.GithubLoginService.githubLogin();
    }
  
    @Mutation(() => AccessTokenResponse)
    async githubCodeExchange(@Args('code') code: string): Promise<AccessTokenResponse> {
      const accessTokenResponse = await this.GithubLoginService.githubCodeExchange(code);
      return accessTokenResponse;
    }
  
    @Mutation(() => GitHubUserDetails)
    async getGithubUser(@Args('accessToken') accessToken: string): Promise<GitHubUserDetails> {
      const githubUser = await this.GithubLoginService.getGithubUser(accessToken);
      return githubUser;
    }
}
