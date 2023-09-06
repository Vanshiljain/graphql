import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Types } from 'mongoose';
import axios from 'axios';
import { GitHubUserOrganization } from './organization.schema';
import { GithubLoginService } from 'src/githubUser/githubUser.service';

@Injectable()
export class GithubUserOrganizationService {
    constructor(
        @InjectModel('GitHubUserOrganization') private readonly GitHubUserOrganizationModel: Model<GitHubUserOrganization>,
        private readonly githubLoginService: GithubLoginService,
    ) {}

    async getUserOrganization(username: string): Promise<GitHubUserOrganization[]> {
        const user = await this.githubLoginService.getGithubUserDetails(username);
        console.log('GitHub User:', user);

        try {
            const response = await axios.get('https://api.github.com/user/orgs', {
                headers: {
                    Authorization: `Bearer ghu_adlOZ2HWza27s3RirN54sjcwCutA2R1EsoRg`,
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

            const organizationInstances = organization.map(orgData => new this.GitHubUserOrganizationModel(orgData));
            await this.GitHubUserOrganizationModel.insertMany(organizationInstances);

            return organizationInstances; // Return the saved instances
        } catch (error) {
            console.error('GitHub API Request Error:', error);
            throw new Error('Failed to fetch user organization');
        }
    }
        async getOrganizationMongoId(organizationId: string): Promise<string | null> {
        const organization = await this.GitHubUserOrganizationModel.findOne({ user_id:organizationId  });
        return organization ? organization._id.toString() : null;
    }

    async getOrganizationIdsByUsername(username: string): Promise<string[]> {
        try {
          const userOrganizations = await this.getUserOrganization(username);
          const organizationIds = userOrganizations.map(org => org._id.toString());
          return organizationIds;
        } catch (error) {
          console.error('Error fetching organization IDs:', error);
          throw new Error('Error fetching organization IDs');
        }
      }
      async findOrganizationByOrgName(orgName: string): Promise<GitHubUserOrganization | null> {
        return this.GitHubUserOrganizationModel.findOne({ org_name: orgName }).exec();
      }
 
    }

// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import axios from 'axios';
// import mongoose from 'mongoose';
// import { GitHubUserOrganization } from './organization.schema'; // Import your organization schema

// @Injectable()
// export class GithubUserOrganizationService {
//     constructor(
//         @InjectModel('GitHubUserOrganization') private readonly GitHubUserOrganizationModel: Model<GitHubUserOrganization>,
//     ) {}

//     async getUserOrganization(username: string): Promise<GitHubUserOrganization[]> {
//         try {
//             // Fetch user organization details from GitHub
//             const response = await axios.get('https://api.github.com/user/orgs', {
//                 headers: {
//                     Authorization: `Bearer ghu_Oz1zYWZ2AgmPWc1Bnny7cSmhHGcLtm0yj1mH`, // Replace with your GitHub token
//                 },
//             });

//             const organizationInstances = response.data.map(org => {
//                 return new this.GitHubUserOrganizationModel({
//                     user_id: org.id,
//                     org_name: org.login,
//                     id: org.id,
//                     node_id: org.node_id,
//                     url: org.url,
//                     repos_url: org.repos_url,
//                     members_url: org.members_url,
//                     githubOrganizationMetadata: response.data,
//                 });
//             });

//             await this.GitHubUserOrganizationModel.insertMany(organizationInstances);
//             return organizationInstances;
//         } catch (error) {
//             console.error('GitHub API Request Error:', error);
//             throw new Error('Failed to fetch user organization');
//         }
//     }

//     async getOrganizationMongoId(organizationId: string): Promise<string | null> {
//         const organization = await this.GitHubUserOrganizationModel.findOne({ id: organizationId });
//         return organization ? organization._id.toString() : null;
//     }
// }
