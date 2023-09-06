import { Resolver, Mutation, Args } from '@nestjs/graphql';

// import { GithubAuthResponse, AccessTokenResponse } from 'src/user/user.schema';

import { Query } from '@nestjs/graphql';
import { GitHubUserDetails } from './github.schema';
import { GithubLoginService } from './githubUser.service';
import { AccessTokenResponse, GithubAuthResponse } from 'src/user/user.schema';
import { CreateGitHubUserInput } from './Creategithubuserinput';
import Stripe from 'stripe';
import { Products } from './product.dto';
import { v4 as uuidv4 } from 'uuid';

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

    // @Mutation(() => GitHubUserDetails)
    // async createGitHubUser(@Args('input') input: CreateGitHubUserInput): Promise<GitHubUserDetails> {
    //     const githubUser = await this.GithubLoginService.getGithubUser(input.accessToken);
    //     const stripeCustomer = await this.GithubLoginService.createStripeCustomer(githubUser);

        
    //     const savedUser = await this.GithubLoginService.saveGitHubUser(githubUser, stripeCustomer.id);

    //     return savedUser;
    // }
  
    @Mutation(() => GitHubUserDetails)
    async getGithubUser(@Args('accessToken') accessToken: string): Promise<GitHubUserDetails> {
      const githubUser = await this.GithubLoginService.getGithubUser(accessToken);
      return githubUser;
    }

    @Query(() => GitHubUserDetails)
    async getGithubUserDetails(@Args('username') username: string): Promise<GitHubUserDetails> {
        return this.GithubLoginService.getGithubUserDetails(username);
    }  
    // @Query(() => [StripeProduct])
    // async allStripeProducts(): Promise<Stripe.Product[]> {
    //   return this.GithubLoginService.fetchProductsFromStripe();
    // } 
   
  
  @Query(() => [Products])
  async productsFromStripe(): Promise<Products[]> {
    return this.GithubLoginService.fetchProductsFromStripe();
  }
  
  @Mutation(() => GitHubUserDetails)
  async createGitHubUser(@Args('input') input: CreateGitHubUserInput): Promise<GitHubUserDetails> {
      const githubUser = await this.GithubLoginService.getGithubUser(input.accessToken);
      const stripeCustomer = await this.GithubLoginService.createStripeCustomer(githubUser);

      
      const savedUser = await this.GithubLoginService.saveGitHubUser(githubUser, stripeCustomer.id);

      return savedUser;
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


  
  
  
  
  