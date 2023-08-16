import { Injectable } from "@nestjs/common";
import { GithubLoginService } from "../github_login/github_login.service";
import axios from "axios";
import { GitHubPull } from "./github_pull.schema";
import { GithubRepositoryService } from "src/github_repository/github_repository.service";
import { InjectModel } from "@nestjs/mongoose"; // Import this
import { Model } from "mongoose";

@Injectable()
export class GithubPullService {
  constructor(
    private readonly githubLoginService: GithubLoginService,
    private readonly githubRepositoryService: GithubRepositoryService,
    @InjectModel(GitHubPull.name) private readonly GitHubPullModel: Model<GitHubPull> // Inject the model
  ) {}

  async getPullRequests(username: string, repo_name: string): Promise<GitHubPull[]> {
    const user = await this.githubLoginService.getGithubUserDetails(username);
    const repo_id = await this.githubRepositoryService.getRepoIdByName(repo_name);

    const query = `
      query {
        repository(name: "${repo_name}", owner: "${username}") {
          pullRequests(last: 10, orderBy: { field: CREATED_AT, direction: DESC }) {
            edges {
              node {
                title
                url
                createdAt
                updatedAt
                closedAt
                mergedAt
                state
              }
            }
          }
        }
      }
    `;

    try {
      const response = await axios.post(
        "https://api.github.com/graphql",
        { query },
        {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        }
      );
      console.log(response.data.data.repository.pullRequests.edges);
      const repository = response.data.data.repository;

      if (!repository) {
        console.error("Repository data not found in API response");
        throw new Error("Failed to fetch pull requests");
      }

      const pullRequests = repository.pullRequests.edges.map((edge: any) => edge.node);

      // Create an array of documents to save in the database
      const pullRequestsToSave = pullRequests.map((pullRequest: any) => {
        return {
          title: pullRequest.title,
          url: pullRequest.url,
          createdAt: pullRequest.createdAt,
          updatedAt: pullRequest.updatedAt,
          closedAt: pullRequest.closedAt,
          mergedAt: pullRequest.mergedAt,
          state: pullRequest.state,
          github_pull_metadata: pullRequest,
          user_id: user._id,
          repo_id: repo_id,
        };
      });

      await this.GitHubPullModel.insertMany(pullRequestsToSave);

      return pullRequests;
    } catch (error) {
      console.error("GitHub API Request Error:", error);
      throw new Error("Failed to fetch pull requests");
    }
  }
}
