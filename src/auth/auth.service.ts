import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt.payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(email);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.userService.findOne(email);
    if (!user || user.password !== password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload: JwtPayload = { email: user.email };
    console.log(payload);
    const token = await this.jwtService.sign(payload);
    console.log(token);
    const userupdate = await this.userService.updateUser(user.email, { token: token });
    console.log(userupdate);
    console.log(user);
    return token;
  }
}
