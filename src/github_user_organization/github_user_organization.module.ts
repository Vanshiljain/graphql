import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GitHubUserOrganization, GitHubUserOrganizationSchema } from './github_user_organization.schema';
import { GithubUserOrganizationService } from './github_user_organization.service';
import { GithubUserOrganizationResolver } from './github_user_organization.resolver';
import { GithubLoginModule } from 'src/github_login/github_login.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'GitHubUserOrganization', schema: GitHubUserOrganizationSchema },
    ]),
    GithubLoginModule,
  ],
  providers: [GithubUserOrganizationService, GithubUserOrganizationResolver],
  exports: [GithubUserOrganizationService],
})
export class GithubUserOrganizationModule {}
