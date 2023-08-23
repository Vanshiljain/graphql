import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import mongoose from 'mongoose';
import { GraphQLJSONObject } from 'graphql-type-json';

export enum RepositoryType {
    UserRepo = 'User',
    OrganizationRepo = 'Organization'
}

registerEnumType(RepositoryType, {
    name: 'RepositoryType',
    description: 'This denote repository type'
})

@ObjectType()
@Schema()
export class GithubWebhook extends Document {
    @Field(() => GraphQLJSONObject, { nullable: true })
    @Prop({ type: Object })
    github_weebhook_metadata: object;

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
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: false })
    user_id: mongoose.Types.ObjectId;

    @Field(() => ID, { nullable: true })
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: false })
    repo_id: mongoose.Types.ObjectId;

    @Field(() => ID, { nullable: true })
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: false })
    author_id: mongoose.Types.ObjectId;

    @Field(() => String, { nullable: true })
    @Prop({ required: false })
    repo_owner: string;

    @Field(() => String, { nullable: true })
    @Prop()
    repo_name: string;

    @Field(() => String, { nullable: true })
    @Prop()
    state: string;

    @Field(() => Number, { nullable: true })
    @Prop()
    number: number;

    @Field(() => String, { nullable: true })
    @Prop()
    id: string;

    @Field(()=> RepositoryType)
    @Prop({ enum: RepositoryType, default: RepositoryType.UserRepo })
    repository_type: RepositoryType;
}

export const GithubWebhookSchema = SchemaFactory.createForClass(GithubWebhook);