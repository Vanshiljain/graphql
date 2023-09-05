import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { BookModule } from './book/bookmodule.module';
import { join } from 'path';
import { AppResolver } from './app.resolver';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.modul';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user/user.schema';
import { UserResolver } from './user/user.resolver';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';
import { TokenModule } from './token/token.module';
import { ScheduleModule } from '@nestjs/schedule';
import { IsoDateModule } from './isoDate/isoDate.module';
import { GithubLoginService } from './githubLogin/githubLogin.service';
import { GithubLoginResolver } from './githubLogin/githubLogin.resolver';
import { GithubLoginModule } from './githubLogin/githubLogin.module';
import { GitHubUserDetailsSchema } from './githubLogin/githubLogin.schema';
import { GithubRepositoryModule } from './githubRepository/githubRepository.module';
import { GithubUserOrganizationModule } from './githubUserOrganization/githubUserOrganization.module';
import { GitHubUserOrganizationSchema } from './githubUserOrganization/githubUserOrganization.schema';
import { GithubPullModule } from './githubPull/githubPull.module';
import { GitHubPullSchema } from './githubPull/githubPull.schema';
import { GithubWebhookModule } from './githubWebhook/githubWebhook.module';
import { GithubWebhook, GithubWebhookSchema } from './githubWebhook/githubWebhook.schema';
import { GithubWebhookService } from './githubWebhook/githubWebhook.service';
import { GithubWorkflowModule } from './githubWorkflow/githubWorkflow.module';
import { GitHubWorkflowRun, GitHubWorkflowRunSchema, GitHubWorkflowJob, GitHubWorkflowJobSchema } from './githubWorkflow/githubWorkflow.schema';
import { StripeModule } from './stripe/stripe.module';


@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      installSubscriptionHandlers: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.graphql'),
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
      },
      subscriptions: {
        'graphql-ws': true,
        'subscriptions-transport-ws': true,
      },
      playground: {
        settings: {
          'request.credentials': 'include',
        },
      },
      cors: {
        origin: '*',
        credentials: true,
      },
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/mydb'),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'GitHubUser', schema: GitHubUserDetailsSchema }]),
    MongooseModule.forFeature([{ name: 'GitHubUserOrganization', schema: GitHubUserOrganizationSchema }]),
    MongooseModule.forFeature([{ name: 'GitHubPull', schema: GitHubPullSchema }]),
    MongooseModule.forFeature([{ name: GithubWebhook.name, schema: GithubWebhookSchema }]),
    MongooseModule.forFeature([{ name: GitHubWorkflowRun.name, schema: GitHubWorkflowRunSchema }]),
    MongooseModule.forFeature([{ name: GitHubWorkflowJob.name, schema: GitHubWorkflowJobSchema }]),
    UserModule,
    BookModule,
    AuthModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
    TokenModule,
    ScheduleModule.forRoot(),
    IsoDateModule,
    GithubLoginModule,
    GithubRepositoryModule,
    GithubUserOrganizationModule,
    GithubPullModule,
    GithubWebhookModule,
    GithubWorkflowModule,
    StripeModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver, UserResolver, UserService, AuthService, GithubLoginService, GithubLoginResolver, GithubWebhookService],
})
export class AppModule { }
