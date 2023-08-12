import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { AccessTokenResponse } from 'src/user/user.schema';
import { GitHubUserDetails } from './github_login.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { response } from 'express';


@Injectable()
export class GithubLoginService {



    constructor( @InjectModel('GitHubUser') private readonly GitHubUserDetails: Model<GitHubUserDetails> ) { }
    async githubLogin(): Promise<{ githubAuthUrl: string }> {
        const params = new URLSearchParams();
        params.append('client_id', process.env.GITHUB_CLIENT_ID);
        params.append('scope', 'read:user user:email');
        params.append('response_type', 'code');
        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&${params.toString()}`;
        return { githubAuthUrl };
    }

    // async githubLogin(): Promise<{ githubAuthUrl: string }> {
    //   const params = new URLSearchParams();
    //   params.append('client_id', process.env.GITHUB_CLIENT_ID);
    //   params.append('scope', 'read:user user:email');
    //   const githubAuthUrl = `
    //   https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}
    // `;
    //   try {
    //     const response = await axios.post(githubAuthUrl, null, {
    //       headers: {
    //         "Content-Type": 'application/json',
    //       },
    //     });
    //     return response.data;
    //   } catch (error) {
    //     console.error('Error:', error);
    //     throw error;
    //   }

    // }


    // async githubCodeExchange(code: string): Promise<AccessTokenResponse> {
    //   const params = new URLSearchParams();
    //   params.append('client_id', process.env.GITHUB_CLIENT_ID);
    //   params.append('client_secret', process.env.GITHUB_CLIENT_SECRET);
    //   params.append('code', code);

    //   try {
    //     const response = await axios.post(
    //       `https://github.com/login/oauth/access_token`,
    //       params,
    //       {
    //         headers: {
    //           Accept: 'application/json',
    //         },
    //       }
    //     );

    //     console.log('GitHub Access Token Response:', response.data);
    //     return response.data;
    //   } catch (error) {
    //     console.error('GitHub Code Exchange Failed:', error);
    //     throw new Error('GitHub code exchange failed');
    //   }
    // }  

    async githubCodeExchange(code: string): Promise<AccessTokenResponse> {
        try {
            const clientId = process.env.GITHUB_CLIENT_ID;
            const clientSecret = process.env.GITHUB_CLIENT_SECRET;
            const redirectUri = process.env.REDIRECT_URI;
    
            const response = await axios.post(`https://github.com/login/oauth/access_token`, null, {
                params: {
                    client_id: clientId,
                    client_secret: clientSecret,
                    code: code,
                    redirect_uri: redirectUri,
                },
                headers: {
                    Accept: 'application/json',
                },
            });
            console.log('GitHub Access Token Response:', response.data);
    
            const userResponse = await axios.get('https://api.github.com/user', {
                headers: {
                    Authorization: `Bearer ${response.data.access_token}`,
                },
            });
            console.log('GitHub User Response:', userResponse.data);
            const githubUser = new this.GitHubUserDetails({
                login: userResponse.data.login,
                node_id: userResponse.data.node_id,
                email: userResponse.data.email,
                name: userResponse.data.name,
                githubUserMetadata: userResponse.data,
                access_token: response.data.access_token,
                token_type: response.data.token_type,
                refresh_token: response.data.refresh_token,
                expires_in: Date.now() + (response.data.expires_in * 1000)
            });
            await githubUser.save();
            return response.data;
        } catch (error) {
            throw new Error('GitHub code exchange failed');
        }
    }
     

    async getGithubUser(accessToken: string): Promise<GitHubUserDetails> {
        const userResponse = await axios.get('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const githubUser = new this.GitHubUserDetails({
            username: userResponse.data.login,
            node_id: userResponse.data.node_id,
            email: userResponse.data.email,
            name: userResponse.data.name,
            githubUserMetadata: userResponse.data,
        });
        
        console.log('GitHub User Response:', userResponse.data);
        return await githubUser.save();
    }

    async getGithubUserDetails(username: string): Promise<GitHubUserDetails> {
        const githubUser = await this.GitHubUserDetails.findOne({ username: username });
        return githubUser;
    }

}
