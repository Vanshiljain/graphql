import { ObjectType, Field, Int, InputType, ID } from '@nestjs/graphql';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Schema } from '@nestjs/mongoose';
import { User, UserInput } from 'src/user/user.schema';
import { Document } from "mongoose";

@ObjectType()
@InputType('InputBook')
export class Author{

  @Field(() => ID, { nullable: true })
  @Prop()
  firstName: string;

  @Field(() => String, { nullable: true })
  @Prop()
  lastName: string;

  @Field( () => Int, { nullable: true })
  @Prop()
  age: number;
}

@InputType('AuthorInput')
export class AuthorInput {

  @Field(() => String, { nullable: true })
  _id?: string;

  @Field(() => String, { nullable: true })
  firstName?: string;

  @Field(() => String, { nullable: true })
  lastName?: string;

  @Field(()=> Int, { nullable: true })
  age?: number;
}

@ObjectType()
@Schema({ _id: true })
export class Book extends Document {

  @Field(() => ID, { nullable: true })
  _id: Types.ObjectId;

  @Field(() => String, { nullable: true })
  @Prop()
  title: string;

  @Field(() => Int, { nullable: true })
  @Prop()
  price: number;

  @Field(() => Int, { nullable: true })
  @Prop()
  year: number;

  @Field(() => [Author], { nullable: true })
  @Prop({type: () => [Author]})
  author: Author[];

  @Field(() => ID, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: 'Aggregation' })
  userId: Types.ObjectId;

  @Field(()=> User, { nullable: true })
  userCollection: User;

  @Field(()=> Author, { nullable: true })
  authorCollection: Author;

  @Field(() => ID, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: 'Aggregation' })
  authorId: Types.ObjectId;
}
export const BookSchema = SchemaFactory.createForClass(Book);

@ObjectType()
@Schema()
export class NewAuthors extends Document {
  @Field(() => ID, { nullable: true })
  _id: Types.ObjectId;

  @Field(() => String, { nullable: true })
  @Prop()
  firstName: string;

  @Field(() => String, { nullable: true })
  @Prop()
  lastName: string;

  @Field(() => Int, { nullable: true })
  @Prop()
  age: number;
}
export const AuthorsSchema = SchemaFactory.createForClass(NewAuthors);

@InputType()
export class BookInput {
  @Field(() => ID, { nullable: true })
  _id?: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  price?: number;

  @Field({ nullable: true })
  year?: number;

  @Field(() => [AuthorInput], { nullable: true })
  author?: AuthorInput[];

  @Field({ nullable: true })
  userId?: string;

  @Field(() => UserInput, { nullable: true })
  userCollection: UserInput;

  @Field(() => AuthorInput, { nullable: true })
  authorCollection: AuthorInput;

  @Field(() => ID, { nullable: true })
  authorId?: string;
}