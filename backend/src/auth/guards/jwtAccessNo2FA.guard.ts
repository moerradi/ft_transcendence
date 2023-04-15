import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';

@Injectable()
export class JwtAccessTokenNo2FAGuard extends AuthGuard('jwt-access-token') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
