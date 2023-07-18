import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtPayload } from './jwt.payload.interface';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: JwtPayload): Promise<any> {
    const { email, privateKey } = payload;

    // Perform a database lookup to check if the user exists
    const user = await this.userService.findOne(email);

    // Check if the user exists and if the privateKey matches
    if (!user || user.privateKey !== privateKey) {
      throw new UnauthorizedException('Invalid token');
    }

    // Return the authenticated user or any other relevant data
    return { email, privateKey };
  }
}
