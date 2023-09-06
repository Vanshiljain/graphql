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
    githubWebhookMetadata: object;

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
    state: string;

    @Field(() => Number, { nullable: true })
    @Prop()
    number: number;

    @Field(() => String, { nullable: true })
    @Prop()
    id: string;

    @Field(()=> RepositoryType)
    @Prop({ enum: RepositoryType, default: RepositoryType.UserRepo })
    repositoryType: RepositoryType;
}

export const GithubWebhookSchema = SchemaFactory.createForClass(GithubWebhook);
