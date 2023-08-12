import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GraphQLJSONObject } from 'graphql-type-json';
import mongoose, { Document, ObjectId } from 'mongoose';

@ObjectType()
@Schema()
export class GitHubRepository extends Document {

    @Field(() => ID)
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
    user_id: mongoose.Types.ObjectId;

    @Field(() => String, { nullable: true })
    @Prop()
    id: string;

    @Field(() => String, { nullable: true })
    @Prop({ required: true })
    name: string;

    @Field(() => String, { nullable: true })
    @Prop()
    description: string;

    @Field(() => String, { nullable: true })
    @Prop({ required: true })
    url: string;

    @Field(() => GraphQLJSONObject, { nullable: true })
    @Prop({ type: Object })
    githubRepositoryMetadata: object;
}

export const GitHubRepositorySchema = SchemaFactory.createForClass(GitHubRepository);
