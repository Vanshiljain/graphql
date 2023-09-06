import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { User, UserSchema } from './user.schema';
import { ConfigService } from '@nestjs/config';


@Module({
<<<<<<< HEAD
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserResolver, UserService,ConfigService],
  exports: [UserService,ConfigService], 
=======
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [UserResolver, UserService],
  exports: [UserService],
>>>>>>> a0bf9a60f07ecabae155be9b3392a5b9c871e8c7
})
export class UserModule {}
