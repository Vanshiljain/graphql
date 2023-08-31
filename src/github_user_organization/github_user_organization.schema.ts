import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GraphQLJSONObject } from 'graphql-type-json';
import mongoose, { Document } from 'mongoose';

@ObjectType()
@Schema()
export class GitHubUserOrganization extends Document {
    @Field({ nullable: true })
    @Prop({ required: true })
    id: number; 
    
    @Field(() => ID)
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
    userId: mongoose.Types.ObjectId;
    
    @Field({ nullable: true })
    @Prop({ required: true })
    orgName: string;

    @Field({ nullable: true })
    @Prop({ required: true })
    nodeId: string;

    @Field({ nullable: true })
    @Prop({ required: true })
    url: string;

    @Field({ nullable: true })
    @Prop({ required: true })
    reposUrl: string;

    @Field({ nullable: true })
    @Prop({ required: true })
    membersUrl: string;

    @Field(() => GraphQLJSONObject, { nullable: true })
    @Prop({ type: Object })
    githubOrganizationMetadata: object;
}

export const GitHubUserOrganizationSchema = SchemaFactory.createForClass(GitHubUserOrganization);
