import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { Query } from '@nestjs/graphql';
import { GitHubUserDetails } from './github.schema';
import { GithubLoginService } from './githubUser.service';
import { AccessTokenResponse, GithubAuthResponse } from 'src/user/user.schema';
import { CreateGitHubUserInput } from './Creategithubuserinput';
import { Products } from './product.dto';


@Resolver()
export class GithubLoginResolver {
  constructor(private readonly GithubLoginService: GithubLoginService,
    ) { }
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
  
    @Query(() => GitHubUserDetails)
    async getGithubUserDetails(@Args('userName') userName: string): Promise<GitHubUserDetails> {
      return this.GithubLoginService.getGithubUserDetails(userName);
    }


  @Mutation((returns) => Boolean)
  async subscribeProduct(@Args('productId') productId: string): Promise<boolean> {
    try {
      await this.GithubLoginService.subscribeProduct(productId);
      return true;
    } catch (error) {
      console.error("Failed to subscribe to the product:", error);
      return false;
    }
  }

  @Query((returns) => Boolean)
  async isProductSubscribed(@Args('productId') productId: string): Promise<boolean> {
    return this.GithubLoginService.isProductSubscribed(productId);
  }

 

 
  }


  
  
  
  
  