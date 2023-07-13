import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    // Extract the token from the Authorization header
    const token = req.headers.authorization?.replace('Bearer ', '');
    // Pass the token to the request context
    req.token = token;

    return req;
  }
}
