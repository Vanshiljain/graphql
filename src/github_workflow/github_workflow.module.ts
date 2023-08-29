import { Module } from '@nestjs/common';
import { GithubWorkflowService } from './github_workflow.service';
import { GithubWorkflowResolver } from './github_workflow.resolver';
import { GithubLoginModule } from 'src/github_login/github_login.module';
import { MongooseModule } from '@nestjs/mongoose';
import { GitHubWorkflowJob, GitHubWorkflowJobSchema, GitHubWorkflowRun, GitHubWorkflowRunSchema } from './github_workflow.schema';
import { GithubRepositoryModule } from 'src/github_repository/github_repository.module';
import { GithubUserOrganizationModule } from 'src/github_user_organization/github_user_organization.module';

@Module({
  imports: [GithubLoginModule,
    MongooseModule.forFeature([{ name: GitHubWorkflowRun.name, schema: GitHubWorkflowRunSchema }]),
    MongooseModule.forFeature([{ name: GitHubWorkflowJob.name, schema: GitHubWorkflowJobSchema }]),
    GithubRepositoryModule,
    GithubUserOrganizationModule,
  ],
  providers: [GithubWorkflowService, GithubWorkflowResolver],
  exports: [GithubWorkflowService]
})
export class GithubWorkflowModule {}
