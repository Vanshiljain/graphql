import { Module } from '@nestjs/common';
import { GithubPullService } from './githubPull.service';
import { GithubPullResolver } from './githubPull.resolver';
import { GitHubPullSchema } from './githubPull.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { GithubLoginModule } from 'src/githubLogin/githubLogin.module';
import { GithubRepositoryModule } from 'src/githubRepository/githubRepository.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'GitHubPull', schema: GitHubPullSchema }]), GithubLoginModule, GithubRepositoryModule],
  providers: [GithubPullService, GithubPullResolver],
  exports: [GithubPullService],
})
export class GithubPullModule { }
