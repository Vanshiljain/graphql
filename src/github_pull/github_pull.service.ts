import { Injectable } from "@nestjs/common";
import { GithubLoginService } from "../github_login/github_login.service";
import axios from "axios";
import { GitHubPull } from "./github_pull.schema";
import { GithubRepositoryService } from "src/github_repository/github_repository.service";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PubSub } from 'graphql-subscriptions';
import { Subscription } from "@nestjs/graphql";

const pubSub = new PubSub();
const NEW_PULL_REQUEST_EVENT = 'newPullRequest';
const NEW_COMMIT_EVENT = 'newCommit';

@Injectable()
export class GithubPullService {
  constructor(
    private readonly githubLoginService: GithubLoginService,
    private readonly githubRepositoryService: GithubRepositoryService,
    @InjectModel(GitHubPull.name) private readonly GitHubPullModel: Model<GitHubPull>
  ) { }

  async createPullRequests(userName: string, repoName: string): Promise<GitHubPull[]> {
    const user = await this.githubLoginService.getGithubUserDetails(userName);
    const repo = await this.githubRepositoryService.getRepoIdByName(repoName);

    const query = `
    query {
      repository(owner: "${userName}", name: "${repoName}") {
        defaultBranchRef {
          name
        }
        description
        isInOrganization
        isPrivate
        name
        nameWithOwner
        pullRequests(first: 50, orderBy: { direction: DESC, field: CREATED_AT }) {
          nodes {
            number
            additions
            author {
              avatarUrl
              login
              url
            }
            baseRefName
            body
            bodyText
            changedFiles
            closed
            commits(first: 50) {
              nodes {
                resourcePath
                commit {
                  abbreviatedOid
                  additions
                  authoredByCommitter
                  authoredDate
                  changedFiles
                  committer {
                    avatarUrl
                    name
                  }
                  commitUrl
                  deletions
                  message
                  messageBody
                  messageHeadline
                  oid
                  pushedDate
                }
                url
              }
            }
            createdAt
            headRefName
            number
            title
            url
          }
        }
        url
      }
    }
  `;

    try {
      const response = await axios.post(
        "https://api.github.com/graphql",
        { query },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      const pullRequests = response.data.data.repository.pullRequests.nodes;

      if (!pullRequests) {
        console.error("Pull requests data not found in API response");
        throw new Error("Failed to fetch pull requests");
      }

      const data = pullRequests.map((pullRequest) => ({
        updateOne: {
          filter: {
            url: pullRequest.url,
          },
          update: {
            $set: {
              title: pullRequest.title,
              url: pullRequest.url,
              createdAt: pullRequest.createdAt,
              updatedAt: pullRequest.updatedAt,
              closedAt: pullRequest.closedAt,
              mergedAt: pullRequest.mergedAt,
              state: pullRequest.state,
              githubPullMetadata: pullRequest,
              userId: user._id,
              repoId: repo._id,
              authorId: user._id,
              repoName: repoName,
              repoOwner: userName,
              number: pullRequest.number,
              commits: pullRequest.commits
            },
          },
          upsert: true,
        },
      }));

      const savedata = await this.GitHubPullModel.bulkWrite(data);
      if (savedata) {
        const updatedPullRequests = await this.getPullRequestFromDb(userName);
        await pubSub.publish(NEW_PULL_REQUEST_EVENT, { newPullRequest: updatedPullRequests });
        if (updatedPullRequests) {
          console.log('Updated pull requests:', updatedPullRequests);
          const commitUrl = pullRequests[0].commits.nodes[0].url;
          const commits = await this.getCommitsForPullRequest(userName, commitUrl, repoName);
          if (commits) {
            await pubSub.publish(NEW_COMMIT_EVENT, { newCommit: commits });
          }
        }
      }
      return data;
    } catch (error) {
      console.error("GitHub API Request Error:", error);
      throw new Error("Failed to fetch pull requests");
    }
  }

  async getPullRequestFromDb(userName: string): Promise<GitHubPull[]> {
    const user = await this.githubLoginService.getGithubUserDetails(userName);
    const pullRequests = await this.GitHubPullModel.find({ authorId: user._id }).sort({ createdAt: -1 });;
    console.log('Pull Requests from DB:', pullRequests);
    return pullRequests;
  }

  async getFilteredPullRequests(userName: string, searchKeyword: string): Promise<GitHubPull[]> {
    const user = await this.githubLoginService.getGithubUserDetails(userName);
    const reg = searchKeyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, ' ');
    console.log('reg >>>>>>>>>>>>>>>>>>>:', reg);
    const aggregationPipeline = [
      {
        $match: {
          authorId: user._id,
          $or: [
            { title: { $regex: reg, $options: 'i' } },
            { baseRefName: { $regex: reg, $options: 'i' } },
            { number: { $regex: reg, $options: 'i' } },
          ],
        },
      },
    ];
    const pullRequests = await this.GitHubPullModel.aggregate(aggregationPipeline);
    console.log('Filtered Pull Requests from DB:', pullRequests);
    return pullRequests;
  }

  @Subscription(() => [GitHubPull], {
    resolve: (value) => value.newPullRequest,
  })
  newPullRequest() {
    return pubSub.asyncIterator(NEW_PULL_REQUEST_EVENT);
  }

  @Subscription(() => GitHubPull, {
    resolve: (value) => value.newCommit,
  })
  newCommit() {
    return pubSub.asyncIterator(NEW_COMMIT_EVENT);
  }

  async getCommitsForPullRequest(userName: string, url: string, repoName: string): Promise<GitHubPull> {
    try {
      const user = await this.githubLoginService.getGithubUserDetails(userName);
      const query = [
        {
          $match: {
            userId: user._id,
            repoName,
          },
        },
        {
          $project: {
            userId: 1,
            repoName: 1,
            commits: 1,
            filterCommits: {
              $filter: {
                input: "$commits.nodes",
                as: "commit",
                cond: { $eq: ["$$commit.url", url] },
              },
            },
          },
        },
        {
          $match: {
            $expr: {
              $gt: [{ $size: "$filterCommits" }, 0],
            },
          },
        },
      ];
  
      const [commit] = await this.GitHubPullModel.aggregate(query);
  
      if (commit) {
        await pubSub.publish(NEW_COMMIT_EVENT, { newCommit: commit });
        console.log('Filtered Pull Requests from DB:', commit);
        return commit;
      } else {
        console.log('No matching commit found.');
        return null;
      }
    } catch (error) {
      console.log('Error in getCommitsForPullRequest:', error);
      throw error;
    }
  }
  
}
