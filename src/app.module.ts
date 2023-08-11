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
import { IsoDateModule } from './iso-date/iso-date.module';
import { GithubLoginService } from './github_login/github_login.service';
import { GithubLoginResolver } from './github_login/github_login.resolver';
import { GithubLoginModule } from './github_login/github_login.module';
import { GitHubUserDetailsSchema } from './github_login/github_login.schema';

@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      playground: true,
      installSubscriptionHandlers: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.graphql'),
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
      },
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/mydb'),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'GitHubUser', schema: GitHubUserDetailsSchema }]),
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
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver, UserResolver, UserService, AuthService, GithubLoginService, GithubLoginResolver],
})
export class AppModule { }
