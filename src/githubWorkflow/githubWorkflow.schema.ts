import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { GraphQLJSONObject } from "graphql-type-json";
import mongoose from "mongoose";

export enum StatusRun {
    in_progress = 'in_progress',
    queued = 'queued',
    completed = 'completed',
}

registerEnumType(StatusRun, {
    name: 'StatusRun',
    description: 'Status of the workflow',
});

export enum StatusJob {
    in_progress = 'in_progress',
    queued = 'queued',
    completed = 'completed',
}

registerEnumType(StatusJob, {
    name: 'StatusJob',
    description: 'Status of the workflowjob',
});

@ObjectType()
@Schema()
export class GitHubWorkflowJob {

    @Field(() => GraphQLJSONObject, { nullable: true })
    @Prop({ type: Object })
    GitHubWorkflowJob: object;

    @Field(() => String, { nullable: true })
    @Prop()
    title: string;

    @Field(() => String, { nullable: true })
    @Prop()
    url: string;

    @Field(() => Date, { nullable: true })
    @Prop()
    createdAt: Date;

    @Field(() => ID, { nullable: true })
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: false })
    userId: mongoose.Types.ObjectId;

    @Field(() => ID, { nullable: true })
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: false })
    repoId: mongoose.Types.ObjectId;

    @Field(() => ID, { nullable: true })
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: false })
    authorId: mongoose.Types.ObjectId;

    @Field(() => String, { nullable: true })
    @Prop({ required: false })
    repoOwner: string;

    @Field(() => String, { nullable: true })
    @Prop()
    repoName: string;

    @Field(() => String, { nullable: true })
    @Prop()
    id: string;

    @Field(()=> StatusRun)
    @Prop({ enum: StatusRun, default: StatusRun.queued })
    Status: StatusRun;

    @Field(() => ID, { nullable: true })
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: false })
    orgId?: mongoose.Types.ObjectId;

    @Field(() => String, { nullable: true })
    @Prop({ required: false })
    orgName?: string;
}

export const GitHubWorkflowJobSchema = SchemaFactory.createForClass(GitHubWorkflowJob);

@ObjectType()
@Schema()
export class GitHubWorkflowRun {

    @Field(() => GraphQLJSONObject, { nullable: true })
    @Prop({ type: Object })
    GitHubWorkflowJob: object;

    @Field(() => String, { nullable: true })
    @Prop()
    title: string;

    @Field(() => String, { nullable: true })
    @Prop()
    url: string;

    @Field(() => Date, { nullable: true })
    @Prop()
    createdAt: Date;

    @Field(() => ID, { nullable: true })
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: false })
    userId: mongoose.Types.ObjectId;

    @Field(() => ID, { nullable: true })
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: false })
    repoId: mongoose.Types.ObjectId;

    @Field(() => ID, { nullable: true })
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: false })
    authorId: mongoose.Types.ObjectId;

    @Field(() => String, { nullable: true })
    @Prop({ required: false })
    repoOwner: string;

    @Field(() => String, { nullable: true })
    @Prop()
    repoName: string;

    @Field(() => String, { nullable: true })
    @Prop()
    id: string;

    @Field(()=> StatusRun)
    @Prop({ enum: StatusRun, default: StatusRun.queued })
    Status: StatusRun;

    @Field(() => ID, { nullable: true })
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: false })
    orgId?: mongoose.Types.ObjectId;

    @Field(() => String, { nullable: true })
    @Prop({ required: false })
    orgName?: string;
}

export const GitHubWorkflowRunSchema = SchemaFactory.createForClass(GitHubWorkflowRun);
