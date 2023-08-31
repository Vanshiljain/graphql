import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GitHubUserOrganization, GitHubUserOrganizationSchema } from './githubUserOrganization.schema';
import { GithubUserOrganizationService } from './githubUserOrganization.service';
import { GithubUserOrganizationResolver } from './githubUserRrganization.resolver';
import { GithubLoginModule } from 'src/githubLogin/githubLogin.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'GitHubUserOrganization', schema: GitHubUserOrganizationSchema }]), GithubLoginModule],
  providers: [GithubUserOrganizationService, GithubUserOrganizationResolver],
  exports: [GithubUserOrganizationService],
})

export class GithubUserOrganizationModule { }
