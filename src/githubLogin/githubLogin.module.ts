import { Module } from '@nestjs/common';
import { GithubLoginService } from './githubLogin.service';
import { GithubLoginResolver } from './githubLogin.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { GitHubUserDetailsSchema } from './githubLogin.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'GitHubUser', schema: GitHubUserDetailsSchema }])
    ],
    providers: [GithubLoginService, GithubLoginResolver],
    exports: [GithubLoginService],
})
export class GithubLoginModule { }
