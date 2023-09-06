import { Module } from '@nestjs/common';
import { GithubRepositoryService } from './githubRepository.service';
import { GithubRepositoryResolver } from './githubRepository.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { GitHubRepositorySchema } from './githubRepository.schema';
import { GithubLoginModule } from 'src/githubLogin/githubLogin.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'GitHubRepository', schema: GitHubRepositorySchema }]), GithubLoginModule],
  providers: [GithubRepositoryService, GithubRepositoryResolver],
  exports: [GithubRepositoryService]
})
export class GithubRepositoryModule { }
