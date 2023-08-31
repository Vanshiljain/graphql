import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { GraphQLJSONObject } from "graphql-type-json";
import mongoose, { Document } from "mongoose";

@ObjectType()
@Schema()
export class GitHubPull extends Document {
    @Field(() => GraphQLJSONObject, { nullable: true })
    @Prop({ type: Object })
    githubPullMetadata: object;

    @Field(() => String, { nullable: true })
    @Prop()
    title: string;

    @Field(() => String, { nullable: true })
    @Prop()
    url: string;

    @Field(() => Date, { nullable: true })
    @Prop()
    createdAt: Date;

    @Field(() => Date, { nullable: true })
    @Prop()
    mergedAt: Date;

    @Field(() => Date, { nullable: true })
    @Prop()
    closedAt: Date;

    @Field(() => Date, { nullable: true })
    @Prop()
    updatedAt: Date;

    @Field(() => ID, { nullable: true })
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
    userId: mongoose.Types.ObjectId;

    @Field(() => ID, { nullable: true })
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
    repoId: mongoose.Types.ObjectId;

    @Field(() => ID, { nullable: true })
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
    authorId: mongoose.Types.ObjectId;

    @Field(() => String, { nullable: true })
    @Prop()
    repoOwner: string;

    @Field(() => String, { nullable: true })
    @Prop()
    repoName: string;

    @Field(() => String, { nullable: true })
    @Prop()
    state: string;

    @Field(() => Number, { nullable: true })
    @Prop()
    number: number;

    @Field(() => GraphQLJSONObject, { nullable: true })
    @Prop({ type: Object })
    commits: object;

    @Field(() => [GraphQLJSONObject], { nullable: true })
    @Prop()
    filterCommits: object[];
}
export const GitHubPullSchema = SchemaFactory.createForClass(GitHubPull);
