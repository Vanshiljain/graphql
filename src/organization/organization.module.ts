import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';


import { GithubUserOrganizationService } from 'src/organizations/organization.service';
import { GithubUserOrganizationResolver } from 'src/organizations/organization.resolver';
import { GitHubUserOrganizationSchema } from 'src/organizations/organization.schema';
import { GithubLoginService } from 'src/githubUser/githubUser.service';
import { GitHubUserDetailsSchema } from 'src/githubUser/github.schema';
import { GithubLoginModule } from 'src/githubUser/githubUser.module';

import { ProductSchema, Products } from 'src/githubUser/product.dto';
import { CreateCheckoutSession, CreateCheckoutSessionSchema } from 'src/githubUser/checkoutsessioninput.dto';



@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'GitHubUserOrganization', schema: GitHubUserOrganizationSchema },
    ]),
    MongooseModule.forFeature([
        { name: 'GitHubUser', schema: GitHubUserDetailsSchema },
      ]),
      MongooseModule.forFeature([{ name: Products.name, schema: ProductSchema }]),
      MongooseModule.forFeature([{ name: CreateCheckoutSession.name, schema: CreateCheckoutSessionSchema }]),
    GithubLoginModule,
  ],
  providers: [GithubUserOrganizationService, GithubUserOrganizationResolver,GithubLoginService],
  exports:[GithubUserOrganizationService]
})
export class GithubUserOrganizationModule {}
