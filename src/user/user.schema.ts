import { Field, Float, ID, InputType, Int, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export enum Gender {
    Male = 'Male',
    Female = 'Female'
}

registerEnumType(Gender, {
    name: 'Gender',
    description: 'This denote user gender'
})

export enum Role {
    admin = 'admin',
    user = 'user',
    superadmin = 'superadmin'
}

registerEnumType(Role, {
    name: 'Role',
    description: 'This denote user role'
})

@ObjectType()
@InputType('InputCourses')
export class Courses {
    @Field(() => String, { nullable: true })
    @Prop()
    courseName: string;

    @Field(() => String, { nullable: true })
    @Prop()
    courseStatus: string;

    @Field(() => String, { nullable: true })
    @Prop()
    publication: string;

    @Field(() => Int, { nullable: true })
    @Prop()
    year: number;
}

@ObjectType()
@InputType('InputAddress')
export class Address {
    @Field(() => String, { nullable: true })
    @Prop()
    mainAddress: string;

    @Field(() => String, { nullable: true })
    @Prop()
    city: string;

    @Field(() => Number, { nullable: true })
    @Prop()
    pincode: number;
}

@ObjectType()
@InputType('Units')
export class Unit {
    @Field(() => Number, { nullable: true })
    @Prop()
    quantity: number;

    @Field(() => Number, { nullable: true })
    @Prop()
    pricePerUnit: number;

    @Field(() => Float, { nullable: true })
    @Prop({ default: null })
    totalPrice?: number;
}

@ObjectType()
@InputType('Descriptions')
export class Description {
    @Field(() => String, { nullable: true })
    @Prop()
    label: string;

    @Field(() => Unit, { nullable: true })
    @Prop()
    unit: Unit;
}

@ObjectType()
@InputType('InputProduct')
export class Product {
    @Field(() => String, { nullable: true })
    @Prop()
    name: string;

    @Field(() => Description, { nullable: true })
    @Prop()
    description: Description;

    @Field(type => [String], { nullable: true })
    @Prop()
    ingridients: string[];

    @Field(() => String, { nullable: true })
    @Prop()
    manufacturer: string;
}

@ObjectType()
@Schema()
export class User extends Document {
    
    @Field(() => ID, { nullable: true })
    _id?: string;

    @Field(() => String, { nullable: true })
    @Prop()
    name: string;

    @Field(() => String, { nullable: true })
    @Prop()
    username: string;

    @Field(() => String, { nullable: true })
    @Prop({ unique: true })
    email: string;

    @Field(() => String, { nullable: true })
    @Prop()
    password: string;

    @Field(() => Gender, { nullable: true })
    @Prop()
    gender: Gender;

    @Field(() => Role, { nullable: true })
    @Prop({ enum: Role, default: Role.user })
    role: Role;

    @Field(() => Address, { nullable: true })
    @Prop()
    address: Address;

    @Field(() => [Courses])
    @Prop({ type: () => [Courses] })
    courses: Courses[];

    @Field(() => Number)
    @Prop({ type: () => Number })
    age: number;

    @Field(() => Courses, { nullable: true })
    lastCourse: Courses;

    @Field(() => [Courses], { nullable: true })
    completedCourses: Courses[];

    @Field(() => [Product])
    @Prop()
    public product: Product[];

    @Field(() => [Product])
    public filterProducts: Product[];

    @Field(() => Float, { nullable: true })
    @Prop()
    public totalSumPrice?: number;

    @Field(() => Float, { nullable: true })
    public OveralltotalSumPrice?: number;

    @Field(() => [Courses], { nullable: true })
    public allCourses: Courses[];

    @Field(()=> String, { nullable: true })
    @Prop()
    public token?: string;

    @Field(()=> String, { nullable: true })
    @Prop()
    public privateKey?: string;

    @Field(()=> String, { nullable: true })
    @Prop()
    public countryCode?: string;

    @Field(()=> Number, { nullable: true })
    @Prop()
    public mobileNumber?: number;
}

@InputType()
export class UserInput {

    @Field(()=> String, { nullable: true })
    name?: string;

    @Field(()=> String, { nullable: true })
    username?: string;

    @Field(()=> String, { nullable: true })
    email?: string;

    @Field(()=> String, { nullable: true })
    password?: string;

    @Field(() => Gender, { nullable: true })
    gender?: Gender;

    @Field(() => Role, { nullable: true })
    role?: Role;

    @Field(() => Address, { nullable: true })
    address?: Address;

    @Field(() => [Courses], { nullable: true })
    courses?: Courses[];

    @Field(() => Int, { nullable: true })
    age?: number;

    @Field(() => Courses, { nullable: true })
    lastCourse?: Courses;

    @Field(() => [Courses], { nullable: true })
    completedCourses?: Courses[];

    @Field(() => [Product], { nullable: true })
    product?: Product[];

    @Field(()=> String, { nullable: true })
    token?: string;

    @Field(()=> String, { nullable: true })
    privateKey?: string;

    @Field(()=> String, { nullable: true })
    countryCode?: string;

    @Field(()=> Number, { nullable: true })
    mobileNumber?: number;
}
export const UserSchema = SchemaFactory.createForClass(User);