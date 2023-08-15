import { Field, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { GraphQLJSONObject } from "graphql-type-json";
import { Document } from "mongoose";

@ObjectType()
@Schema()
export class GitHubPull extends Document {
    @Field(() => GraphQLJSONObject, { nullable: true })
    @Prop({ type: Object})
    github_pull_metadata: object;

    @Field(() => String)
    title: string;

    @Field(() => String)
    url: string;

    @Field(() => Date)
    occurredAt: Date;
}

export const GitHubPullSchema = SchemaFactory.createForClass(GitHubPull);