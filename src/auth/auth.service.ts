import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt.payload.interface';
import * as bcrypt from 'bcrypt';
import { TokenService } from 'src/token/token.service';


@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
  ) { }

  async login(email: string, password: string): Promise<string> {
    const user = await this.userService.findOne(email);
<<<<<<< HEAD

    if (!user) {
      throw new UnauthorizedException('Invalid credentials - User not found');
=======
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
>>>>>>> a0bf9a60f07ecabae155be9b3392a5b9c871e8c7
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("isPasswordvalid", isPasswordValid)
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials - Incorrect password');
    }

    const payload: JwtPayload = { email: user.email, privateKey: user.privateKey };
    const token = this.jwtService.sign(payload);
    await this.userService.updateUser(user.email, { token });

    await this.tokenService.createToken({ email: user.email, token, refreshToken: '' });
    // Do not update the token in the user document here.
    return token;
  }
<<<<<<< HEAD

=======
   
>>>>>>> a0bf9a60f07ecabae155be9b3392a5b9c871e8c7
  async logout(email: string): Promise<string> {
    const user = await this.userService.findOne(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const newPrivateKey = await this.generateNewPrivateKey();
    const updatedUser = await this.userService.updateUser(user.email, { privateKey: newPrivateKey });
    console.log(updatedUser);
    console.log(user);
    return 'Logout';
  }

  private async generateNewPrivateKey(): Promise<string> {
    const saltRounds = 6;
    const salt = await bcrypt.genSalt(saltRounds);
    const newPrivateKey = await bcrypt.hash(salt, salt);
    return newPrivateKey;
  }

  
}

