// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { GraphQLModule } from '@nestjs/graphql';
// import { ApolloDriver } from '@nestjs/apollo';
// import { BookModule } from './book/bookmodule.module';
// import { join } from 'path';
// import { AppResolver } from './app.resolver';
// import { UserService } from './user/user.service';
// import { UserModule } from './user/user.modul';
// import { MongooseModule } from '@nestjs/mongoose';
// import { User, UserSchema } from './user/user.schema';
// import { UserResolver } from './user/user.resolver';
// import { AuthService } from './auth/auth.service';
// import { AuthModule } from './auth/auth.module';
// import { JwtModule } from '@nestjs/jwt';
// import { jwtConstants } from './auth/constants';
// import { TokenModule } from './token/token.module';
// import { ScheduleModule } from '@nestjs/schedule';
// import { IsoModule } from './ISO/iso.module';
// import { HttpModule } from '@nestjs/axios';
// import { ConfigModule } from '@nestjs/config/dist';



// import { WebhookModule } from './webhook/webhook.module';
// import { WebhookController } from './webhook/webhook.controller';
// import { WebhookEventService } from './webhook/webhook.event.service';
// import { Webhook, webhookSchema } from './webhook/webhook.dto';
// import { GitHubUserOrganizationSchema } from './rganizations/organization.schema';
// import { GithubUserOrganizationModule } from './rganizations/organization.module';
// import { GithubLoginModule } from './githubUser/githubUser.module';
// import { GitHubUserDetails, GitHubUserDetailsSchema } from './githubUser/github.schema';
// import { GithubUserOrganizationService } from './rganizations/organization.service';

// @Module({
//   imports: [
//     GraphQLModule.forRoot({
//       driver: ApolloDriver,
//       playground: true,
//       installSubscriptionHandlers: true,
//       autoSchemaFile: join(process.cwd(), 'src/schema.graphql'),
//       definitions: {
//         path: join(process.cwd(), 'src/graphql.ts'),
//       },
//     }),

    
//     ConfigModule.forRoot(),
//     MongooseModule.forRoot('mongodb://127.0.0.1:27017/mydb'),
//     MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
//     MongooseModule.forFeature([{ name: GitHubUserDetails.name, schema: GitHubUserDetailsSchema }]),
//     MongooseModule.forFeature([{ name: Webhook.name, schema: webhookSchema }]),
//     MongooseModule.forFeature([
//       { name: 'GitHubUserOrganization', schema: GitHubUserOrganizationSchema },
//     ]),
    
//     UserModule,
//     BookModule,
//     AuthModule,
//     HttpModule,
//     JwtModule.register({
//       secret: jwtConstants.secret,
//       signOptions: { expiresIn: '1h' },
//     }),
//     TokenModule,
//     ScheduleModule.forRoot(),
//     GithubLoginModule,
//     // IsoModule,GithubUserModule,
//     WebhookModule,
//     GithubUserOrganizationModule
//   ],
//   controllers: [AppController,WebhookController],
//   providers: [AppService, AppResolver, UserResolver, UserService, AuthService,WebhookEventService,GithubUserOrganizationService]
// })
// export class AppModule { }
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config/dist';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppResolver } from './app.resolver';
import { UserService } from './user/user.service';

import { User, UserSchema } from './user/user.schema';
import { UserResolver } from './user/user.resolver';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './token/token.module';
<<<<<<< HEAD
import { BookModule } from './book/bookmodule.module';
import { GitHubUserDetails, GitHubUserDetailsSchema } from './githubUser/github.schema';
import { GitHubUserOrganizationSchema } from './organizations/organization.schema';
import { GithubUserOrganizationModule } from './organizations/organization.module';
import { GithubLoginModule } from './githubUser/githubUser.module';
import { WebhookModule } from './webhook/webhook.module';
import { WebhookController } from './webhook/webhook.controller';
import { WebhookEventService } from './webhook/webhook.event.service';
import { PubSub } from 'graphql-subscriptions';
import { UserModule } from './user/user.modul';
import { AppWebhook, gitHubAppWebhookSchema} from './webhook/webhook.dto';

// import { AppWebhook, appWebhookSchema} from './webhook/webhook.dto';

import { StripewebModule } from './stripeweb/stripeweb.module';
=======
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
>>>>>>> a0bf9a60f07ecabae155be9b3392a5b9c871e8c7


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
<<<<<<< HEAD
=======
      playground: {
        settings: {
          'request.credentials': 'include',
        },
      },
      cors: {
        origin: '*',
        credentials: true,
      },
>>>>>>> a0bf9a60f07ecabae155be9b3392a5b9c871e8c7
    }),

    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/mydb'),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
<<<<<<< HEAD
    MongooseModule.forFeature([{ name: GitHubUserDetails.name, schema: GitHubUserDetailsSchema }]),
    MongooseModule.forFeature([{ name: AppWebhook.name, schema: gitHubAppWebhookSchema }]),

    MongooseModule.forFeature([
      { name: 'GitHubUserOrganization', schema: GitHubUserOrganizationSchema },
    ]),

=======
    MongooseModule.forFeature([{ name: 'GitHubUser', schema: GitHubUserDetailsSchema }]),
    MongooseModule.forFeature([{ name: 'GitHubUserOrganization', schema: GitHubUserOrganizationSchema }]),
    MongooseModule.forFeature([{ name: 'GitHubPull', schema: GitHubPullSchema }]),
    MongooseModule.forFeature([{ name: GithubWebhook.name, schema: GithubWebhookSchema }]),
    MongooseModule.forFeature([{ name: GitHubWorkflowRun.name, schema: GitHubWorkflowRunSchema }]),
    MongooseModule.forFeature([{ name: GitHubWorkflowJob.name, schema: GitHubWorkflowJobSchema }]),
>>>>>>> a0bf9a60f07ecabae155be9b3392a5b9c871e8c7
    UserModule,
    BookModule,
    AuthModule,
    HttpModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
    TokenModule,
    ScheduleModule.forRoot(),
<<<<<<< HEAD
    GithubLoginModule,
    WebhookModule,
    GithubUserOrganizationModule,
    StripewebModule,
    StripewebModule,
  ],
  controllers: [AppController, WebhookController],
  providers: [AppService, AppResolver, UserResolver, UserService, AuthService, WebhookEventService,PubSub],
=======
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
>>>>>>> a0bf9a60f07ecabae155be9b3392a5b9c871e8c7
})
export class AppModule {}
