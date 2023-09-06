import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => String)
  async login(@Args('email') email: string, @Args('password') password: string) {
    return this.authService.login(email, password);
  }

  @Mutation(() => String)
  async logout(@Args('email') email: string) {
    return this.authService.logout(email);
  }
 
}
