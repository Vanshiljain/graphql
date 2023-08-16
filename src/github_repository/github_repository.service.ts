import mongoose, { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GitHubRepository, RepositoryType } from './github_repository.schema';
import axios from 'axios';
import { GithubLoginService } from 'src/github_login/github_login.service';

@Injectable()
export class GithubRepositoryService {
    constructor(
        @InjectModel(GitHubRepository.name) private readonly GitHubRepositoryModel: Model<GitHubRepository>,
        private readonly githubLoginService: GithubLoginService,
    ) { }

    async getUserRepositories(username: string): Promise<GitHubRepository[]> {
        const user = await this.githubLoginService.getGithubUserDetails(username);
        console.log('GitHub User:', user);

        try {
            const response = await axios.get('https://api.github.com/user/repos', {
                headers: {
                    Authorization: `Bearer ${user.access_token}`,
                },
            });
            // console.log('GitHub User Repositories Response:', response.data);

            const repositories = response.data.map(repo => ({
                user_id: user._id,
                id: repo.id,
                name: repo.name,
                description: repo.description,
                url: repo.html_url,
                githubRepositoryMetadata: repo,
            }));

            const repoInstances = repositories.map(repoData => new this.GitHubRepositoryModel(repoData));
            await this.GitHubRepositoryModel.insertMany(repoInstances);

            return repositories;
        } catch (error) {
            console.error('GitHub API Request Error:', error);
            throw new Error('Failed to fetch user repositories');
        }
    }


    async getOrganizationRepositories(username: string, org_name:string): Promise<GitHubRepository[]> {
        const user = await this.githubLoginService.getGithubUserDetails(username);

        try {
            const response = await axios.get(`https://api.github.com/orgs/${org_name}/repos`, {
                headers: {
                    Authorization: `Bearer ${user.access_token}`,
                },
            });
            // console.log('GitHub User Organizations Repositories Response:', response.data);


            const repositories: GitHubRepository[] = response.data.map(repoData => ({
                user_id: user._id,
                repository_type: RepositoryType.OrganizationRepo,
                id: repoData.id.toString(),
                name: repoData.name,
                description: repoData.description,
                url: repoData.url,
                githubRepositoryMetadata: repoData,
            }));

            const repoInstances = repositories.map(repoData => new this.GitHubRepositoryModel(repoData));
            await this.GitHubRepositoryModel.insertMany(repoInstances);

            console.log('GitHub User Organizations Repositories Response:', repositories);
            return repositories;
        } catch (error) {
            console.error('GitHub API Request Error:', error);
            throw new Error('Failed to fetch user organizations repositories');
        }
    }

    async getRepoIdByName(repo_name: string): Promise<string> {
        const repo = await this.GitHubRepositoryModel.findOne({ name: repo_name });
        if (!repo) {
            throw new Error('Repo not found');
        }
        return repo._id;
    }

}
