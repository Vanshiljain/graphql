
import { InputType, Field } from '@nestjs/graphql';
import { Prop, SchemaFactory } from '@nestjs/mongoose';

@InputType()
export class CreateCheckoutSession {

  @Field()
  @Prop({ required: true })
  productId: string;
}

export const CreateCheckoutSessionSchema = SchemaFactory.createForClass(CreateCheckoutSession);