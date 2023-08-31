import { Module } from '@nestjs/common';
import { GithubLoginService } from './github_login.service';
import { GithubLoginResolver } from './github_login.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { GitHubUserDetailsSchema } from './github_login.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'GitHubUser', schema: GitHubUserDetailsSchema }])
    ],
    providers: [GithubLoginService, GithubLoginResolver],
    exports: [GithubLoginService],
})
export class GithubLoginModule { }
