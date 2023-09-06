import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GitHubUserOrganization } from './githubUserOrganization.schema';
import { GithubLoginService } from 'src/githubLogin/githubLogin.service';
import axios from 'axios';

@Injectable()
export class GithubUserOrganizationService {
    constructor(@InjectModel('GitHubUserOrganization') private readonly GitHubUserOrganizationModel: Model<GitHubUserOrganization>,
    private readonly githubLoginService: GithubLoginService,
    ) {}
    
    async getUserOrganization(userName: string): Promise<GitHubUserOrganization[]> {
        const user = await this.githubLoginService.getGithubUserDetails(userName);
        try {
            const response = await axios.get('https://api.github.com/user/orgs', {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`,
                },
            });
            const organization = response.data.map(org => ({
                userId: user._id,
                orgName: org.login,
                id: org.id,
                nodeId: org.nodeId,
                url: org.url,
                reposUrl: org.reposUrl,
                membersUrl: org.membersUrl,
                githubOrganizationMetadata: response.data,
            }));
            const organizationInstance = organization.map(repoData => new this.GitHubUserOrganizationModel(repoData));
            await this.GitHubUserOrganizationModel.insertMany(organizationInstance);
            return organization;
        } catch (error) {
            console.error('GitHub API Request Error:', error);
            throw new Error('Failed to fetch user organization');
        }
    }

    getGitHubUserOrganization(userName: string): Promise<GitHubUserOrganization[]> {
        return this.GitHubUserOrganizationModel.find({ userId: userName }).exec();
    }

    async getOrganizationIdByName(orgName: string): Promise<GitHubUserOrganization> {
        return this.GitHubUserOrganizationModel.findOne({ orgName: orgName }).exec();
    }
}
