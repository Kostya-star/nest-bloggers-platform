import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// the guard to use for authenticated and non-authenticated users
// if user token is ok - inject user object into the request, otherwise - return null
@Injectable()
export class JwtAuthOptionalGuard extends AuthGuard('jwt-auth-guard') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  // override handleRequest method of AuthGuard
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      return null;
    }

    // inject user object into the request
    return user;
  }
}
