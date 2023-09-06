import { Field, Float, ID, InputType, Int, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document} from "mongoose";


@ObjectType()
@Schema({ timestamps: true })

export class Token extends Document {
  @Prop()
  token: string;

  @Prop()
  email: string;

  @Prop()
  refreshToken: string;

//   @Prop({ expires: 60 }) // Expiration time set to 1 minute (60 seconds)
//   createdAt: Date;
}

@InputType()
export class TokenInput {
    @Field(() => String, { nullable: true })
    token: string;

    @Field(() => String, { nullable: true })
    email: string;

    @Field(() => String, { nullable: true })
    refreshToken: string;
}
export const TokenSchema = SchemaFactory.createForClass(Token);
TokenSchema.index({ createdAt: 1 }, { expires: 20})
