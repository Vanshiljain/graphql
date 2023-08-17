import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { GraphQLJSONObject } from "graphql-type-json";
import mongoose, { Document } from "mongoose";

@ObjectType()
@Schema()
export class GitHubPull extends Document {
    @Field(() => GraphQLJSONObject, { nullable: true })
    @Prop({ type: Object })
    github_pull_metadata: object;

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
    user_id: mongoose.Types.ObjectId;

    @Field(() => ID, { nullable: true })
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
    repo_id: mongoose.Types.ObjectId;

    @Field(() => ID, { nullable: true })
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
    author_id: mongoose.Types.ObjectId;
    
    @Field(() => String, { nullable: true })
    @Prop()
    repo_owner: string;

    @Field(() => String, { nullable: true })
    @Prop()
    repo_name: string;

    @Field(() => String, { nullable: true })
    @Prop()
    state: string;

    @Field(() => Number, { nullable: true })
    @Prop()
    number : number;
}
export const GitHubPullSchema = SchemaFactory.createForClass(GitHubPull);