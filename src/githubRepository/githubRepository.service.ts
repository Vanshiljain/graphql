import mongoose, { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GitHubRepository, RepositoryType } from './githubRepository.schema';
import axios from 'axios';
import { GithubLoginService } from 'src/githubLogin/githubLogin.service';

@Injectable()
export class GithubRepositoryService {
    constructor(
        @InjectModel(GitHubRepository.name) private readonly GitHubRepositoryModel: Model<GitHubRepository>,
        private readonly githubLoginService: GithubLoginService,
    ) { }

    async getUserRepositories(userName: string): Promise<GitHubRepository[]> {
        const user = await this.githubLoginService.getGithubUserDetails(userName);
        console.log('GitHub User:', user);
        try {
            const response = await axios.get('https://api.github.com/user/repos', {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`,
                },
            });
            const repositories = response.data.map(repo => ({
                userId: user._id,
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

    async getOrganizationRepositories(userName: string, orgName: string): Promise<GitHubRepository[]> {
        const user = await this.githubLoginService.getGithubUserDetails(userName);
        try {
            const response = await axios.get(`https://api.github.com/orgs/${orgName}/repos`, {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`,
                },
            });
            const repositories: GitHubRepository[] = response.data.map(repoData => ({
                userId: user._id,
                repositoryType: RepositoryType.OrganizationRepo,
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

    async getRepoIdByName(repoName: string): Promise<GitHubRepository> {
        const repo = await this.GitHubRepositoryModel.findOne({ name: repoName });
        if (!repo) {
            throw new Error('Repo not found');
        }
        return repo;
    }
}
