import { Injectable } from "@nestjs/common";
import { GithubLoginService } from "../github_login/github_login.service";
import axios from "axios";
import { GitHubPull } from "./github_pull.schema";
import { GithubRepositoryService } from "src/github_repository/github_repository.service";

@Injectable()
export class GithubPullService {
  constructor(private readonly githubLoginService: GithubLoginService,
    private readonly githubRepositoryService: GithubRepositoryService
    ) { }

  async getPullRequests(username: string, repo_name: string): Promise<GitHubPull[]> {
    const user = await this.githubLoginService.getGithubUserDetails(username);
    const repo = await this.githubRepositoryService.getRepoIdByName(repo_name);
    console.log(repo);
  
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
  
      return pullRequests;
    } catch (error) {
      console.error("GitHub API Request Error:", error);
      throw new Error("Failed to fetch pull requests");
    }
  }
  }
