import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { FriendService } from './friend.service';
import { JwtAccessTokenGuard } from 'src/auth/guards/jwtaccess.guard';
import { userPayload } from 'src/auth/types/userPayload';
import { Request } from 'express';

@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Get('friends/:login')
  @UseGuards(JwtAccessTokenGuard)
  async getFriends(@Param('login') login: string) {
    return await this.friendService.getFriends(login);
  }

  @Get('requests')
  @UseGuards(JwtAccessTokenGuard)
  async getFriendRequests(@Req() req: Request & { user: userPayload }) {
    return await this.friendService.getFriendRequests(req.user.id);
  }

  @Get('requests/sent')
  @UseGuards(JwtAccessTokenGuard)
  async getSentFriendRequests(@Req() req: Request & { user: userPayload }) {
    return await this.friendService.getSentFriendRequests(req.user.id);
  }

  @Post('add/:login')
  @UseGuards(JwtAccessTokenGuard)
  async addFriend(
    @Req() req: Request & { user: userPayload },
    @Param('login') login: string,
  ) {
    return await this.friendService.sendFriendRequest(req.user.id, login);
  }

  @Post('accept/:login')
  @UseGuards(JwtAccessTokenGuard)
  async acceptFriendRequest(
    @Req() req: Request & { user: userPayload },
    @Param('login') login: string,
  ) {
    return await this.friendService.acceptFriendRequest(req.user.id, login);
  }

  @Post('decline/:login')
  @UseGuards(JwtAccessTokenGuard)
  async declineFriendRequest(
    @Req() req: Request & { user: userPayload },
    @Param('login') login: string,
  ) {
    return await this.friendService.deleteFriendRequest(req.user.id, login);
  }

  @Post('unfriend/:login')
  @UseGuards(JwtAccessTokenGuard)
  async unfriend(
    @Req() req: Request & { user: userPayload },
    @Param('login') login: string,
  ) {
    return await this.friendService.unfriend(req.user.id, login);
  }

  @Post('block/:login')
  @UseGuards(JwtAccessTokenGuard)
  async block(
    @Req() req: Request & { user: userPayload },
    @Param('login') login: string,
  ) {
    return await this.friendService.blockFriend(req.user.id, login);
  }

  @Post('unblock/:login')
  @UseGuards(JwtAccessTokenGuard)
  async unblock(
    @Req() req: Request & { user: userPayload },
    @Param('login') login: string,
  ) {
    return await this.friendService.unblockFriend(req.user.id, login);
  }
}
