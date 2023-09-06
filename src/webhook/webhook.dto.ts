
// enum AppType {
//   PERSONAL = 'User',
//   ORGANIZATION = 'organization',
// }


// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import mongoose, { Document, Types } from 'mongoose';
// import { ObjectType, Field, ID } from '@nestjs/graphql';
// import { GraphQLJSONObject } from 'graphql-type-json';

// @ObjectType()
// @Schema({ timestamps: true })
// export class AppWebhook {

//   @Prop()
//   installationId: string;
  
//   @Field()
//   @Prop({ required: true, enum: ['created', 'deleted'] })
//   action: string;

//   @Field()
//   @Prop()
//   username: string;

//   @Field(() => String)
//   @Prop({ enum: AppType })
//   appType: string; 

//   @Field(() => String)
//   @Prop({ type: Types.ObjectId, required: true }) 
//   userId: Types.ObjectId;


//   @Field(() => ID) // Add this field for organization ID
//   @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
//   organization_id: mongoose.Types.ObjectId;

//   @Field() // Add this field for organization name
//   @Prop({ required: true })
//   org_name: string;


//   @Field(() => GraphQLJSONObject, { nullable: true })
//   @Prop({ type: Object })
// AppEventMetadata: object;


// }

// export type AppWebhookDocument = AppWebhook & Document;

// export const gitHubAppWebhookSchema = SchemaFactory.createForClass(AppWebhook);


// // @ObjectType()
// // @Schema({ timestamps: true })
// // export class OrganizationAppWebhook {

// //   @Prop()
// //   installationId: string;
  
// //   @Field()
// //   @Prop({ required: true, enum: ['created', 'deleted'] })
// //   action: string;

// //   @Field()
// //   @Prop()
// //   username: string;

// //   @Field(() => String)
// //   @Prop({ enum: AppType })
// //   appType: string; 

// //   @Field(() => String)
// //   @Prop({ type: Types.ObjectId, required: true }) 
// //   userId: Types.ObjectId;

// //   @Field(() => GraphQLJSONObject, { nullable: true })
// //   @Prop({ type: Object })
// //   githubOrganizationEventMetadata: object;
  

// // }

// // export type OrganizationAppWebhookDocument = OrganizationAppWebhook & Document;

// // export const organizationAppWebhookSchema = SchemaFactory.createForClass(OrganizationAppWebhook);


// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import mongoose, { Document, Types } from 'mongoose';
// import { ObjectType, Field, ID } from '@nestjs/graphql';
// import { GraphQLJSONObject } from 'graphql-type-json';

// @ObjectType()
// @Schema({ timestamps: true })
// export class AppWebhook extends Document {
//     @Prop()
//     installationId: string;

//     @Field()
//     @Prop({ required: true, enum: ['created', 'deleted'] })
//     action: string;

//     @Field()
//     @Prop()
//     username: string;

//     @Field(() => String)
//     @Prop({ enum: AppType })
//     appType: string;

//     @Field(() => String)
//     @Prop({ type: Types.ObjectId, required: true })
//     userId: Types.ObjectId;

//     // Add the organization_id field to store the organization's ObjectId
//     @Field(() => ID)
//     @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'GitHubUserOrganization', required: false })
//     organization_id: mongoose.Types.ObjectId;

//     @Field(() => GraphQLJSONObject, { nullable: true })
//     @Prop({ type: Object })
//     AppEventMetadata: object;
// }

// export type AppWebhookDocument = AppWebhook & Document;

// export const appWebhookSchema = SchemaFactory.createForClass(AppWebhook);
enum AppType {
  PERSONAL = 'User',
  ORGANIZATION = 'organization',
}


import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@ObjectType()
@Schema({ timestamps: true })
export class AppWebhook {

  @Prop()
  installationId: string;
  
  @Field()
  @Prop({ required: true, enum: ['created', 'deleted'] })
  action: string;

  @Field()
  @Prop()
  username: string;

  @Field(() => String)
  @Prop({ enum: AppType })
  appType: string; 


  @Field(() => ID)
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  userId: mongoose.Types.ObjectId;

  
  @Field(() => ID)
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
 orgid : mongoose.Types.ObjectId;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @Prop({ type: Object })
AppEventMetadata: object;


}

export type AppWebhookDocument = AppWebhook & Document;

export const gitHubAppWebhookSchema = SchemaFactory.createForClass(AppWebhook);