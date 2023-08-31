import { Module } from '@nestjs/common';
import { GithubWorkflowService } from './githubWorkflow.service';
import { GithubWorkflowResolver } from './githubWorkflow.resolver';
import { GithubLoginModule } from 'src/githubLogin/githubLogin.module';
import { MongooseModule } from '@nestjs/mongoose';
import { GitHubWorkflowJob, GitHubWorkflowJobSchema, GitHubWorkflowRun, GitHubWorkflowRunSchema } from './githubWorkflow.schema';
import { GithubRepositoryModule } from 'src/githubRepository/githubRepository.module';
import { GithubUserOrganizationModule } from 'src/githubUserOrganization/githubUserOrganization.module';

@Module({
  imports: [GithubLoginModule,
    MongooseModule.forFeature([{ name: GitHubWorkflowRun.name, schema: GitHubWorkflowRunSchema }]),
    MongooseModule.forFeature([{ name: GitHubWorkflowJob.name, schema: GitHubWorkflowJobSchema }]),
    GithubRepositoryModule, GithubUserOrganizationModule
  ],
  providers: [GithubWorkflowService, GithubWorkflowResolver],
  exports: [GithubWorkflowService]
})

export class GithubWorkflowModule {}
