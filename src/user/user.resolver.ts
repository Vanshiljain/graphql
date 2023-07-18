import { Args, Float, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User, Courses, Role, Product, UserInput } from './user.schema';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import * as bcrypt from 'bcrypt';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  async createUser(
    @Args('payload') payload: UserInput,
  ): Promise<User> {
    const salt = await bcrypt.genSalt(6);
    payload.privateKey = salt;
    return await this.userService.createUser(payload);
  }

  @Query(() => [User])
  async findAllUser(
    @Args('role') role: Role,
    @Args('minAge') minAge: number,
    @Args('maxAge') maxAge: number,
  ): Promise<User[]> {
    const allUsers = this.userService.findAllUser();
    const filteredUsers = (await allUsers).filter((user) => {
      return user.role === role && user.age >= minAge && user.age <= maxAge;
    });
    return filteredUsers;
  }

  @Query(() => [User])
  async findUserAll(): Promise<User[]> {
    return await this.userService.findAllUser();
  }

  @Query(() => [User])
  async findUserByMatch(@Args('role') role: string): Promise<User[]> {
    return await this.userService.findUserByMatch(role);
  }

  @Query(() => [User])
  async findUserByQty(@Args('quantity') quantity: number): Promise<User[]> {
    return await this.userService.findUserByQty(quantity);
  }

  @Query(() => Float)
  async totalSumPrice() {
    return await this.userService.totalSumPrice();
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [User])
  async getAllCourses(): Promise<Courses[]> {
    const allCourses = await this.userService.getAllCourses();
    return allCourses;
  }
  
  @Query(() => User)
  async findOne(@Args('email') email: String): Promise<User> {
    return await this.userService.findOne(email);
  }
}
