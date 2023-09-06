import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { AccessTokenResponse } from 'src/user/user.schema';
import { GitHubUserDetails } from './githubLogin.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';


@Injectable()
export class GithubLoginService {
    constructor(@InjectModel('GitHubUser') private readonly GitHubUserDetails: Model<GitHubUserDetails>) { }
    async githubLogin(): Promise<{ githubAuthUrl: string }> {
        const params = new URLSearchParams();
        params.append('client_id', process.env.GITHUB_CLIENT_ID);
        params.append('scope', 'read:user user:email');
        params.append('response_type', 'code');
        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&${params.toString()}`;
        return { githubAuthUrl };
    }

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
                userName: userResponse.data.login,
                login: userResponse.data.login,
                nodeId: userResponse.data.node_id,
                email: userResponse.data.email,
                name: userResponse.data.name,
                githubUserMetadata: userResponse.data,
                accessToken: response.data.access_token,
                tokenType: response.data.token_type,
                refreshToken: response.data.refresh_token,
                expiresIn: Date.now() + (response.data.expires_in * 1000)
            });
            await githubUser.save();
            const responseDataWithuserName = {
                ...response.data,
                userName: userResponse.data.login,
            };
            return responseDataWithuserName;
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
            userName: userResponse.data.login,
            nodeId: userResponse.data.node_id,
            email: userResponse.data.email,
            name: userResponse.data.name,
            githubUserMetadata: userResponse.data,
        });
        console.log('GitHub User Response:', userResponse.data);
        return await githubUser.save();
    }

    async getGithubUserDetails(userName: string): Promise<GitHubUserDetails> {
        const githubUser = await this.GitHubUserDetails.findOne({ userName: userName });
        return githubUser;
    }
}
