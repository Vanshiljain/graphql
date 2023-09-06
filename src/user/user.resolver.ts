import { Args, Float, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User, Courses, Role, Product, UserInput, GithubAuthResponse, AccessTokenResponse } from './user.schema';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import * as bcrypt from 'bcrypt';
import { ID } from 'graphql-ws';


@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) { }

  @Mutation(() => User)
  async createUser(@Args('payload') payload: UserInput): Promise<User> {
    const salt = await bcrypt.genSalt(6);
    payload.privateKey = salt;
    return await this.userService.createUser(payload);
  }

  @Query(() => [User])
<<<<<<< HEAD
async findAllUser(
  @Args('role') role: Role,
  @Args('minAge') minAge: number,
  @Args('maxAge') maxAge: number,
): Promise<User[]> {
  console.log('Received role:', role);
  console.log('Received minAge:', minAge);
  console.log('Received maxAge:', maxAge);

  return await this.userService.findAllUser(role, minAge, maxAge);
}


  @Query(() => [User])
  async findUserAll(
    @Args('role') role: Role,
    @Args('minAge') minAge: number,
    @Args('maxAge') maxAge: number,
  ): Promise<User[]> {
    // Pass the arguments to the userService.findAllUser function
    return this.userService.findAllUser(role, minAge, maxAge);
=======
  async findAllUser(@Args('role') role: Role, @Args('minAge') minAge: number, @Args('maxAge') maxAge: number): Promise<User[]> {
    const allUsers = this.userService.findAllUser();
    const filteredUsers = (await allUsers).filter((user) => {
      return user.role === role && user.age >= minAge && user.age <= maxAge;
    });
    return filteredUsers;
  }

  @Query(() => [User])
  async findUserAll(): Promise<User[]> {
    return await this.userService.findAllUser();
>>>>>>> a0bf9a60f07ecabae155be9b3392a5b9c871e8c7
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
<<<<<<< HEAD
  @Mutation(() => User)
  async updateUser(@Args('email') email: string, @Args('payload') payload: UserInput): Promise<User> {
    try {
      const updatedUser = await this.userService.updateUser(email, payload);
      if (!updatedUser) {
        throw new Error('User not found'); // Or any appropriate error message
      }
      return updatedUser;
    } catch (error) {
      // Handle the error and throw an appropriate exception
      throw new Error('Failed to update user: ' + error.message);
    }
  }


  @Mutation(() => User)
  async deleteUser(@Args('id') id: string): Promise<User> {
    return this.userService.deleteUser(id);
  }
  @Mutation(() => Boolean)
  async checkUserExists(@Args('email') email: string): Promise<boolean> {
    try {

      const userExists = await this.userService.checkUserExists(email);
      return userExists;
    } catch (error) {
     
      console.error('Error checking user existence:', error);
      throw new Error('Failed to check user existence');
    }

    
  }
  
  
=======

  @Mutation(() => User)
  async updateUser(@Args('email') email: string, @Args('payload') payload: UserInput): Promise<User> {
    return await this.userService.updateUser(email, payload);
  }

  @Mutation(() => User)
  async deleteUser(@Args('id') _id: ID): Promise<User> {
    return await this.userService.deleteUser(_id);
  }

  @Query(() => User)
  async findEmail(@Args('email') email: string): Promise<User> {
    return await this.userService.findOne(email);
  }
>>>>>>> a0bf9a60f07ecabae155be9b3392a5b9c871e8c7
}
