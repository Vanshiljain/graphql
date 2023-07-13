import { Args, Float, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { Address, User, Courses, Role, Product, UserInput } from './user.schema';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  async createUser(
    @Args('payload') payload: UserInput,
  ): Promise<User> {
    const { name, username, email, password, role, gender, courses, address, age, product } = payload;
    return await this.userService.createUser(name, username, email, password, role, gender, courses, address, age, product);
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

  @Query(() => [User])
  async getAllCourses(): Promise<Courses[]> {
    const allCourses = await this.userService.getAllCourses();
    return allCourses;
  }

  @Query(() => User)
  async findoneUser(@Args('id') id: string): Promise<User> {
    return await this.userService.findoneUser(id);
  }
}
