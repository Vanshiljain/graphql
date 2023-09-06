import { Field, ID, InputType, ObjectType } from "@nestjs/graphql";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document} from "mongoose";


@ObjectType()
<<<<<<< HEAD
@Schema({ timestamps: true })

=======
@Schema( { timestamps: true } )
>>>>>>> a0bf9a60f07ecabae155be9b3392a5b9c871e8c7
export class Token extends Document {
  @Prop()
  token: string;

  @Prop()
  email: string;

  @Prop()
  refreshToken: string;

<<<<<<< HEAD
//   @Prop({ expires: 60 }) // Expiration time set to 1 minute (60 seconds)
//   createdAt: Date;
=======
    @Field(() => String, { nullable: true })
    @Prop()
    email: string;

    @Field(() => String, { nullable: true })
    @Prop()
    refreshToken: string;
>>>>>>> a0bf9a60f07ecabae155be9b3392a5b9c871e8c7
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
<<<<<<< HEAD
TokenSchema.index({ createdAt: 1 }, { expires: 20})
=======
TokenSchema.index({ createdAt: 1 }, { expires: 20 });
>>>>>>> a0bf9a60f07ecabae155be9b3392a5b9c871e8c7
