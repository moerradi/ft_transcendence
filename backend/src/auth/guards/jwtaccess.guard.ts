import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';

@Injectable()
export class JwtAccessTokenGuard extends AuthGuard('jwt-access-token') {
  async canActivate(context: ExecutionContext) {
    const isValid = await super.canActivate(context);
    if (!isValid) {
      return false;
    }
    const request = context.switchToHttp().getRequest();
    if (request.user.twofa) {
      throw new ForbiddenException(
        'Congrats you broke the matrix, haha just joking complete your 2fa flow idiot !',
      );
    }

    return true;
  }
}
