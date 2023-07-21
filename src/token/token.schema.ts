import { Field, Float, ID, InputType, Int, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@ObjectType()
// @index({ createdAt: 1 }, { expires: '2h' })
@Schema( { timestamps: true } )
export class Token extends Document {

    @Field(() => ID, { nullable: true })
    _id?: string;

    @Field(() => String, { nullable: true })
    @Prop()
    token: string;

    @Field(() => String, { nullable: true })
    @Prop()
    email: string;

    @Field(() => String, { nullable: true })
    @Prop()
    refreshToken: string;

    // @Field(() => Date, { expires: '2h' })
    // @Prop({ default: Date.now })
    // createdAt: Date;

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
TokenSchema.index({ createdAt: 1 }, { expires: 20 });