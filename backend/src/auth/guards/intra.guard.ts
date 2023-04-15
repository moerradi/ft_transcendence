import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class IntraGuard extends AuthGuard('intra42') {
  constructor() {
    super();
  }
  handleRequest(err: any, user: any) {
    if (!user || err) throw new UnauthorizedException('Unauthorized');
    return user;
  }
}
