import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document} from 'mongoose';

import { GraphQLJSONObject } from 'graphql-type-json';
@ObjectType()
@Schema()
export class PaymentIntent extends Document {
  @Prop()
  @Field({ nullable: true })
  paymentIntentId: String;

  @Prop()
  @Field({ nullable: true })
  reason: String;

  @Prop()
  @Field({ nullable: true })
  status: string; 

  @Prop({ type: Date, default: Date.now }) 
  @Field()
  createdAt: Date;

  @Prop()
  @Field({ nullable: true })
  subscriptionId: string;


  @Prop()
  @Field({ nullable: true })
  invoiceId: string;
  
  @Prop({ type: String })
  @Field({ nullable: true }) 
  plan: string;

  @Prop()
  @Field({ nullable: true })
  invoice_pdf: string; 

  @Field(() => GraphQLJSONObject, { nullable: true })
  @Prop({ type: Object })
  metadata: any;

 

  @Field(() => ID)
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  userId: mongoose.Types.ObjectId;

  @Prop()
  @Field({ nullable: true })
  customerName: string; 
  
}

export const PaymentIntentSchema = SchemaFactory.createForClass(PaymentIntent);
