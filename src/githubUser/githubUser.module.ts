import { Module } from '@nestjs/common';

import { UserModule } from 'src/user/user.modul';
import { UserSchema } from 'src/user/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { GitHubUserDetailsSchema } from './github.schema';
import { GithubLoginService } from './githubUser.service';
import { GithubLoginResolver } from './githubUser.resolver';
import { ProductSchema, Products } from './product.dto';
import { CreateCheckoutSession, CreateCheckoutSessionSchema } from './checkoutsessioninput.dto';


@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'GitHubUser', schema: GitHubUserDetailsSchema }]),
 
        MongooseModule.forFeature([{ name: Products.name, schema: ProductSchema }]),
        MongooseModule.forFeature([{ name: CreateCheckoutSession.name, schema: CreateCheckoutSessionSchema }])
    ],
    
    providers: [GithubLoginService, GithubLoginResolver],
    exports: [GithubLoginService],
})
export class GithubLoginModule { }