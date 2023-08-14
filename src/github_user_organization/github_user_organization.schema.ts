import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@ObjectType()
@Schema()
export class GitHubUserOrganization extends Document {
    @Field({ nullable: true })
    @Prop({ required: true })
    id: number; 
    
    @Field(() => ID)
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
    user_id: mongoose.Types.ObjectId;
    
    @Field({ nullable: true })
    @Prop({ required: true })
    org_name: string;

    @Field({ nullable: true })
    @Prop({ required: true })
    node_id: string;

    @Field({ nullable: true })
    @Prop({ required: true })
    url: string;

    @Field({ nullable: true })
    @Prop({ required: true })
    repos_url: string;

    @Field({ nullable: true })
    @Prop({ required: true })
    members_url: string;
}

export const GitHubUserOrganizationSchema = SchemaFactory.createForClass(GitHubUserOrganization);
