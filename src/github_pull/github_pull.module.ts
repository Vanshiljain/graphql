import { Module } from '@nestjs/common';
import { GithubPullService } from './github_pull.service';
import { GithubPullResolver } from './github_pull.resolver';
import {  GitHubPullSchema } from './github_pull.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { GithubLoginModule } from 'src/github_login/github_login.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'GitHubPull', schema: GitHubPullSchema }]),
        GithubLoginModule],
  providers: [GithubPullService, GithubPullResolver]
})
export class GithubPullModule {}
