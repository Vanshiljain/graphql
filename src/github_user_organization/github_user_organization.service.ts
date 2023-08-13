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
        console.log('GitHub User:', user);
    
        try {
            const response = await axios.get('https://api.github.com/user/orgs', {
                headers: {
                    Authorization: `Bearer ${user.access_token}`,
                },
            });
            // console.log('GitHub User Repositories Response:', response.data);

            const organization = response.data.map(org => ({
                user_id: user._id,
                // id: org.id,
                // name: org.name,
                // description: org.description,
                // url: org.html_url,
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
