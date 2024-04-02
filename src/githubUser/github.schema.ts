import { Field, ID, ObjectType, Scalar } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { GraphQLJSONObject } from 'graphql-type-json';

@ObjectType()
@Schema()
export class GitHubUserDetails extends Document {
  @Field(() => ID)
  _id: string;

  @Field(() => String, { nullable: true })
  @Prop()
  username: string;

  @Field(() => String, { nullable: true })
  @Prop()
  email: string;

  @Field(() => String, { nullable: true })
  @Prop()
  name: string;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @Prop({ type: Object })
  githubUserMetadata: object;

  @Field(() => String, { nullable: true })
  @Prop() 
  access_token: string;

  @Field(() => String, { nullable: true })
  @Prop()
  token_type: string;

  @Field(() => String, { nullable: true })
  @Prop()
  refresh_token: string;

  @Field(() => Number, { nullable: true })
  @Prop()
  expires_in: Number;


@Field()
  @Prop({ required: true }) // Assuming stripeCustomerId is required
    stripeCustomerId: string;
}

export const GitHubUserDetailsSchema = SchemaFactory.createForClass(GitHubUserDetails);