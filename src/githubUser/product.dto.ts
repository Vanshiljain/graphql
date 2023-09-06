import { ObjectType, Field, Int,  GraphQLISODateTime } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { GraphQLJSONObject } from 'graphql-type-json';



@ObjectType()
@Schema()
export class Products {
  @Field()
  @Prop()
  id: string;

  @Prop()
  @Field()
  name: string;

  

  @Prop({ type: Object })
  @Field(() => GraphQLJSONObject, { nullable: true })
  metadata: object;

  @Prop()
  @Field()
  description: string;

  @Prop()
  @Field()
  currency: string;

  @Prop()
  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  
}
export type ProductDocument = Products & Document;
export const ProductSchema = SchemaFactory.createForClass(Products);
