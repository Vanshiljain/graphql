import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { PlanType } from './Enum';
import { JSONObject } from 'src/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
@ObjectType()
@Schema()
export class StripeInvoice extends Document {
  @Prop()
  @Field({ nullable: true })
  invoiceId: string;

  @Prop()
  @Field({ nullable: true })
  customerId: string;

  @Prop()
  @Field({ nullable: true })
  productId: string; 

  @Prop()
  @Field({ nullable: true })
  status: string; 

  @Prop({ type: Date, default: Date.now }) 
  @Field()
  createdAt: Date;

  @Prop()
  @Field({ nullable: true })
  subscriptionId: string;


  @Field(() => GraphQLJSONObject, { nullable: true })
  @Prop({ type: Object })
  product: JSONObject;
  
  @Prop({ type: String })
  @Field({ nullable: true }) 
  plan: string;

  @Prop()
  @Field({ nullable: true })
  invoice_pdf: string; 

  @Prop()
  @Field()
  receipt_url: string; 

  @Prop()
  @Field({ nullable: true })
  customerName: string; 


  @Field(() => GraphQLJSONObject, { nullable: true })
  @Prop({ type: Object })
  metadata: any;

  @Field(() => ID)
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  userId: mongoose.Types.ObjectId;
  
}

export const StripeInvoiceSchema = SchemaFactory.createForClass(StripeInvoice);
