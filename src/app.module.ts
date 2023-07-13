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
    UserModule,
    BookModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver, UserResolver, UserService],
})
export class AppModule { }
