
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
import { BookModule } from './book/bookmodule.module';
import { GitHubUserDetails, GitHubUserDetailsSchema } from './githubUser/github.schema';
import { GitHubUserOrganizationSchema } from './organizations/organization.schema';
import { GithubUserOrganizationModule } from './organizations/organization.module';
import { WebhookModule } from './webhook/webhook.module';
import { WebhookController } from './webhook/webhook.controller';
import { WebhookEventService } from './webhook/webhook.event.service';
import { PubSub } from 'graphql-subscriptions';
import { UserModule } from './user/user.modul';
import { AppWebhook, gitHubAppWebhookSchema} from './webhook/webhook.dto';
import { StripewebModule } from './stripeweb/stripeweb.module'
import { GithubLoginModule } from './githubUser/githubUser.module';
import { GithubLoginService } from './githubUser/githubUser.service';
import { GithubLoginResolver } from './githubUser/githubUser.resolver';






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

    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/mydb'),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
 
    MongooseModule.forFeature([{ name: GitHubUserDetails.name, schema: GitHubUserDetailsSchema }]),
    MongooseModule.forFeature([{ name: AppWebhook.name, schema: gitHubAppWebhookSchema }]),

    MongooseModule.forFeature([
      { name: 'GitHubUserOrganization', schema: GitHubUserOrganizationSchema },
    ]),

 
   
  
    
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
 
    GithubLoginModule,
    WebhookModule,
    GithubUserOrganizationModule,
    StripewebModule,
    StripewebModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver, UserResolver, UserService, AuthService],
})
export class AppModule {}
