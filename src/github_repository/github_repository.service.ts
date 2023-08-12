import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GitHubRepository } from './github_repository.schema';
import axios from 'axios';

@Injectable()
export class GithubRepositoryService {
    constructor(
        @InjectModel(GitHubRepository.name) private readonly GitHubRepositoryModel: Model<GitHubRepository>,
    ) { }

    async getUserRepositories(accessToken: string): Promise<GitHubRepository[]> {
    
        try {
            const response = await axios.get('https://api.github.com/user/repos', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log('GitHub User Repositories Response:', response.data);

            const repositories = response.data.map(repo => ({
                id: repo.id,
                name: repo.name,
                description: repo.description,
                url: repo.html_url,
            }));

            const repoInstances = repositories.map(repoData => new this.GitHubRepositoryModel(repoData));
            await this.GitHubRepositoryModel.insertMany(repoInstances);

            return repositories;
        } catch (error) {
            console.error('GitHub API Request Error:', error);
            throw new Error('Failed to fetch user repositories');
        }
    }
}
