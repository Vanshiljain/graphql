import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@ObjectType()
@Schema()
export class GitHubUserOrganization extends Document {
    @Field({ nullable: true })
    @Prop({ required: true })
    id: number;

    @Field({ nullable: true })
    @Prop({ required: true })
    name: string;

    @Field({ nullable: true })
    @Prop()
    description: string;

    @Field({ nullable: true })
    @Prop()
    url: string;
}

export const GitHubUserOrganizationSchema = SchemaFactory.createForClass(GitHubUserOrganization);
