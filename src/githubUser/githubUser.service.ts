
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Stripe from 'stripe';
import { AccessTokenResponse } from 'src/user/user.schema';
import { GitHubUserDetails } from './github.schema';
import {  Products } from './product.dto';
import { CreateCheckoutSession } from './checkoutsessioninput.dto';


@Injectable()
export class GithubLoginService {
    private stripe: Stripe;
    private subscribedProducts: string[] = [];

    constructor(@InjectModel('GitHubUser') private readonly GitHubUserDetails: Model<GitHubUserDetails>,
    @InjectModel(Products.name) private readonly productModel: Model<Products>,
    @InjectModel(CreateCheckoutSession.name) private readonly CreateCheckoutSessionModel: Model<CreateCheckoutSession>)
     {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2023-08-16', // Set the Stripe API version here
        });
    }

    async githubLogin(): Promise<{ githubAuthUrl: string }> {
        const params = new URLSearchParams();
       
        const REDIRECT_URI = "http://localhost:5173/users";
        console.log("client id----->",process.env.GITHUB_CLIENT_ID)

        params.append('client_id', process.env.GITHUB_CLIENT_ID);
        params.append('scope', 'read:user user:email');
        params.append('response_type', 'code');
        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&${params.toString()}`;
        return { githubAuthUrl };
       
    }

    async githubCodeExchange(code: string): Promise<AccessTokenResponse> {
        try {
        
            const REDIRECT_URI = "http://localhost:5173/users";

            const response = await axios.post(`https://github.com/login/oauth/access_token`, null, {
                params: {
                    client_id: process.env.GITHUB_CLIENT_ID,
                    client_secret: process.env.GITHUB_CLIENT_SECRET,
                    code: code,
                    redirect_uri: REDIRECT_URI,
                },
                headers: {
                    Accept: 'application/json',
                },
            });

            const { access_token } = response.data;

            // You can return the access token or create a custom response object here
            return access_token ;
        } catch (error) {
            throw new Error('GitHub code exchange failed');
        }
    }

    

    async getGithubUser(accessToken: string): Promise<any> {
        try {
            const userResponse = await axios.get('https://api.github.com/user', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            return userResponse.data;
        } catch (error) {
            throw new Error('GitHub user retrieval failed');
        }
    }

    async createStripeCustomer(githubUser: any): Promise<Stripe.Customer> {
        try {
            const stripeCustomer = await this.stripe.customers.create({
                email: githubUser.email,
                name: githubUser.login,
                metadata: {
                    github_username: githubUser.login,
                },
            });
            return stripeCustomer;
        } catch (error) {
            throw new Error('Stripe customer creation failed');
        }
    }


    async saveGitHubUser(githubUser: any, stripeCustomerId: string): Promise<GitHubUserDetails> {
        const newUser = new this.GitHubUserDetails({
            username: githubUser.login,
            email: githubUser.email,
            name: githubUser.login,
            githubUserMetadata: githubUser,

            stripeCustomerId: stripeCustomerId, 
            
        });
         console.log("Id------------>",stripeCustomerId)
        return await newUser.save();
    }
    async getGithubUserDetails(username: string): Promise<GitHubUserDetails> {
        const githubUser = await this.GitHubUserDetails.findOne({ username: username });
        return githubUser;
    }


async fetchProductsFromStripe(): Promise<Products[]> {
    
    const stripeProducts = await this.stripe.products.list();
    const products = await this.productModel.create(stripeProducts.data);

    return products;
  }

  async subscribeProduct(productId: string): Promise<void> {
    if (!this.subscribedProducts.includes(productId)) {
      this.subscribedProducts.push(productId);
    }
  }

  async isProductSubscribed(productId: string): Promise<boolean> {
    return this.subscribedProducts.includes(productId);
  }

    }
    

