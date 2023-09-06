
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Stripe from 'stripe';
import { AccessTokenResponse } from 'src/user/user.schema';
import { GitHubUserDetails } from './github.schema';
import {  Products } from './product.dto';
import { CreateCheckoutSession } from './checkoutsessioninput.dto';


const productPriceMap = {
    'prod_OTSz36GvYL2nFO': 'price_1NgW3DSF1NOxI0iYI8jB5S7e',
    'prod_OTSwpLDUQDnYEO' : 'price_1NgW0pSF1NOxI0iYHebcWNV3',
    'prod_OTSv8TLyMerkic' : 'price_1NgVzwSF1NOxI0iYZjgaOfSH',
    
};
const productMap = {
    'prod_OVyfCtcn93gEn1': 'price_1NiwhySF1NOxI0iYVj71cpSR',
    'prod_OVycaUjQ3AxwQJ' : 'price_1NiwfLSF1NOxI0iY0sjmTRbW',
    'prod_OVyX0s9XovLnE4' : 'price_1NiwaFSF1NOxI0iYZSmq6O1N'
    
};

@Injectable()
export class GithubLoginService {
    private stripe: Stripe;
    private subscribedProducts: string[] = [];

    constructor(@InjectModel('GitHubUser') private readonly GitHubUserDetails: Model<GitHubUserDetails>,
    @InjectModel(Products.name) private readonly productModel: Model<Products>,
    @InjectModel(CreateCheckoutSession.name) private readonly CreateCheckoutSessionModel: Model<CreateCheckoutSession>)
     {
        this.stripe = new Stripe('sk_test_51NgRMXSF1NOxI0iYRNdDvi6rAKKK5Ui5dkf5izwSODfZzKSuNYFud0uAk70maYGrx7C3wP99ItLQvEC3ckGmY5sK00THMZ8bGz', {
            apiVersion: '2023-08-16', // Set the Stripe API version here
        });
    }

    async githubLogin(): Promise<{ githubAuthUrl: string }> {
        const params = new URLSearchParams();
        const GITHUB_CLIENT_ID = "Iv1.ab080b76c18d17ce";
        const REDIRECT_URI = "http://localhost:5173/users";

        params.append('client_id', GITHUB_CLIENT_ID);
        params.append('scope', 'read:user user:email');
        params.append('response_type', 'code');
        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&${params.toString()}`;
        return { githubAuthUrl };
    }

    async githubCodeExchange(code: string): Promise<AccessTokenResponse> {
        try {
            const GITHUB_CLIENT_ID = 'Iv1.ab080b76c18d17ce';
            const GITHUB_CLIENT_SECRET = 'd1483e41f955a9fe3d13b18e1377c3b43f1a92f0';
            const REDIRECT_URI = "http://localhost:5173/users";

            const response = await axios.post(`https://github.com/login/oauth/access_token`, null, {
                params: {
                    client_id: GITHUB_CLIENT_ID,
                    client_secret: GITHUB_CLIENT_SECRET,
                    code: code,
                    redirect_uri: REDIRECT_URI,
                },
                headers: {
                    Accept: 'application/json',
                },
            });

            const userResponse = await axios.get('https://api.github.com/user', {
                headers: {
                    Authorization: `Bearer ${response.data.access_token}`,
                },
            });

            const githubUser = await this.getGithubUser(userResponse.data.access_token);
            const stripeCustomer = await this.createStripeCustomer(githubUser);

            return response.data;
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


   

   
    


  async onetimeplan(productId: string): Promise<string> {
    const product = await this.stripe.products.retrieve(productId);

    try {
        const { id: productid, name: productname, metadata: proMetadata, default_price: price } = product;
        const priceid = productMap[productId];

        if (!priceid) {
            throw new Error('Price ID not found for the given product ID');
        }

        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceid,
                    quantity: 1,
                },
            ],
            metadata: {
                product_id: productid,
                productName: productname,
                product_metadata: JSON.stringify(proMetadata),
                type:'onetime',
            },
            mode: 'payment', 
            success_url: 'http://localhost:5173/one-time', 
            cancel_url: 'http://localhost:5173/cancel', 
         

        });
        

        return session.url;
    } catch (error) {
        console.error('Error creating checkout session:', error);
        throw error;
    }
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
    

