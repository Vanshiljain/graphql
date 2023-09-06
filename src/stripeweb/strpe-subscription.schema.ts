import { Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { PlanType } from './Enum';

@Schema()
export class StripeSubscription extends Document {


  @Prop()
  customerId: string;

  @Prop({ type: Boolean, default: true }) 
  isActive: boolean;

  @Prop({ type: Object }) // Add the metadata field
  metadata: any;

  @Prop({ type: Object }) // Add the metadata field
  price: any;

  @Prop({ type: Object })
  product: Record<string, any>;
  
  @Field(() => ID)
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  userId: mongoose.Types.ObjectId;

 @Prop({ type: String, enum: [PlanType.RECURRING, PlanType.ONE_TIME] }) 
  plan: PlanType; 


}

export const StripeSubscriptionSchema = SchemaFactory.createForClass(StripeSubscription);
