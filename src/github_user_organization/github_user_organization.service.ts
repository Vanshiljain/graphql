import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GitHubUserOrganization } from './github_user_organization.schema';
import { GithubLoginService } from 'src/github_login/github_login.service';
import axios from 'axios';

@Injectable()
export class GithubUserOrganizationService {
    constructor(@InjectModel('GitHubUserOrganization') private readonly GitHubUserOrganizationModel: Model<GitHubUserOrganization>,
    private readonly githubLoginService: GithubLoginService,
    ) {}

    
    async getUserOrganization(username: string): Promise<GitHubUserOrganization[]> {
        const user = await this.githubLoginService.getGithubUserDetails(username);
        // console.log('GitHub User:', user);
    
        try {
            const response = await axios.get('https://api.github.com/user/orgs', {
                headers: {
                    Authorization: `Bearer ${user.access_token}`,
                },
            });

            const organization = response.data.map(org => ({
                user_id: user._id,
                org_name: org.login,
                id: org.id,
                node_id: org.node_id,
                url: org.url,
                repos_url: org.repos_url,
                members_url: org.members_url,
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
}
