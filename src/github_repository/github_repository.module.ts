import { Module } from '@nestjs/common';
import { GithubRepositoryService } from './github_repository.service';
import { GithubRepositoryResolver } from './github_repository.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { GitHubRepositorySchema } from './github_repository.schema';
import { GithubLoginModule } from 'src/github_login/github_login.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'GitHubRepository', schema: GitHubRepositorySchema }]), GithubLoginModule],
  providers: [GithubRepositoryService, GithubRepositoryResolver],
  exports: [GithubRepositoryService]
})
export class GithubRepositoryModule { }
