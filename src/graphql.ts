
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum Gender {
    Male = "Male",
    Female = "Female"
}

export enum Role {
    admin = "admin",
    user = "user",
    superadmin = "superadmin"
}

export interface InputCourses {
    courseName?: Nullable<string>;
    courseStatus?: Nullable<string>;
    publication?: Nullable<string>;
    year?: Nullable<number>;
}

export interface InputAddress {
    mainAddress?: Nullable<string>;
    city?: Nullable<string>;
    pincode?: Nullable<number>;
}

export interface Units {
    quantity?: Nullable<number>;
    pricePerUnit?: Nullable<number>;
    totalPrice?: Nullable<number>;
}

export interface Descriptions {
    label?: Nullable<string>;
    unit?: Nullable<Units>;
}

export interface InputProduct {
    name?: Nullable<string>;
    description?: Nullable<Descriptions>;
    ingridients?: Nullable<string[]>;
    manufacturer?: Nullable<string>;
}

export interface InputBook {
    firstName?: Nullable<string>;
    lastName?: Nullable<string>;
    age?: Nullable<number>;
}

export interface UserInput {
    name?: Nullable<string>;
    username?: Nullable<string>;
    email?: Nullable<string>;
    password?: Nullable<string>;
    gender?: Nullable<Gender>;
    role?: Nullable<Role>;
    address?: Nullable<InputAddress>;
    courses?: Nullable<InputCourses[]>;
    age?: Nullable<number>;
    lastCourse?: Nullable<InputCourses>;
    completedCourses?: Nullable<InputCourses[]>;
    product?: Nullable<InputProduct[]>;
    token?: Nullable<string>;
}

export interface BookInput {
    _id?: Nullable<string>;
    title?: Nullable<string>;
    price?: Nullable<number>;
    year?: Nullable<number>;
    author?: Nullable<AuthorInput[]>;
    userId?: Nullable<string>;
    userCollection?: Nullable<UserInput>;
    authorCollection?: Nullable<AuthorInput>;
    authorId?: Nullable<string>;
}

export interface AuthorInput {
    _id?: Nullable<string>;
    firstName?: Nullable<string>;
    lastName?: Nullable<string>;
    age?: Nullable<number>;
}

export interface Courses {
    courseName?: Nullable<string>;
    courseStatus?: Nullable<string>;
    publication?: Nullable<string>;
    year?: Nullable<number>;
}

export interface Address {
    mainAddress?: Nullable<string>;
    city?: Nullable<string>;
    pincode?: Nullable<number>;
}

export interface Unit {
    quantity?: Nullable<number>;
    pricePerUnit?: Nullable<number>;
    totalPrice?: Nullable<number>;
}

export interface Description {
    label?: Nullable<string>;
    unit?: Nullable<Unit>;
}

export interface Product {
    name?: Nullable<string>;
    description?: Nullable<Description>;
    ingridients?: Nullable<string[]>;
    manufacturer?: Nullable<string>;
}

export interface User {
    _id?: Nullable<string>;
    name?: Nullable<string>;
    username?: Nullable<string>;
    email?: Nullable<string>;
    password?: Nullable<string>;
    gender?: Nullable<Gender>;
    role?: Nullable<Role>;
    address?: Nullable<Address>;
    courses: Courses[];
    age: number;
    lastCourse?: Nullable<Courses>;
    completedCourses?: Nullable<Courses[]>;
    product: Product[];
    filterProducts: Product[];
    totalSumPrice?: Nullable<number>;
    OveralltotalSumPrice?: Nullable<number>;
    allCourses?: Nullable<Courses[]>;
    token?: Nullable<string>;
}

export interface Author {
    firstName?: Nullable<string>;
    lastName?: Nullable<string>;
    age?: Nullable<number>;
}

export interface Book {
    _id?: Nullable<string>;
    title?: Nullable<string>;
    price?: Nullable<number>;
    year?: Nullable<number>;
    author?: Nullable<Author[]>;
    userId?: Nullable<string>;
    userCollection?: Nullable<User>;
    authorCollection?: Nullable<Author>;
    authorId?: Nullable<string>;
}

export interface IQuery {
    index(): string | Promise<string>;
    findAllUser(role: string, minAge: number, maxAge: number): User[] | Promise<User[]>;
    findUserAll(): User[] | Promise<User[]>;
    findUserByMatch(role: string): User[] | Promise<User[]>;
    findUserByQty(quantity: number): User[] | Promise<User[]>;
    totalSumPrice(): number | Promise<number>;
    getAllCourses(): User[] | Promise<User[]>;
    findOne(email: string): User | Promise<User>;
    findAllBookUser(): Book[] | Promise<Book[]>;
    findAllAuhtor(): Book[] | Promise<Book[]>;
}

export interface IMutation {
    createUser(payload: UserInput): User | Promise<User>;
    createBook(title: string, author: InputBook[], price: number, year: number, userId: string): Book | Promise<Book>;
    updateBook(bookInput: BookInput, _id: string): Book | Promise<Book>;
    login(email: string, password: string): string | Promise<string>;
}

type Nullable<T> = T | null;