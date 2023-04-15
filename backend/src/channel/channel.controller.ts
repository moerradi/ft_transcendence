import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto, UpdateChannelDto } from './dto/channel.dto';
import { JwtAccessTokenGuard } from 'src/auth/guards/jwtaccess.guard';

@Controller('channels')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Get('')
  @UseGuards(JwtAccessTokenGuard)
  async all(@Req() req) {
    return this.channelService.getAllChannels(req.user.id);
  }

  @Post()
  @UseGuards(JwtAccessTokenGuard)
  async createChannel(@Req() req, @Body() data: CreateChannelDto) {
    return this.channelService.createChannel(data, req.user.id);
  }

  @Get('search')
  @UseGuards(JwtAccessTokenGuard)
  async search(@Req() req, @Query('q') q: string) {
    return this.channelService.searchChannels(req.user.id, q);
  }

  @Get(':id/info')
  @UseGuards(JwtAccessTokenGuard)
  async getChannel(@Param('id', ParseIntPipe) id: number) {
    return this.channelService.getChannel(id);
  }

  @Get(':id/me')
  @UseGuards(JwtAccessTokenGuard)
  async channelMeInfo(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.channelService.getChannelMeInfo(id, req.user.id);
  }

  @Get(':id/messages')
  @UseGuards(JwtAccessTokenGuard)
  async messages(@Param('id', ParseIntPipe) id: number) {
    return this.channelService.getChannelMessages(id);
  }

  @Get(':id/members')
  @UseGuards(JwtAccessTokenGuard)
  async members(@Param('id', ParseIntPipe) id: number) {
    return this.channelService.getChannelMembers(id);
  }

  @Get(':id/nonmembers')
  @UseGuards(JwtAccessTokenGuard)
  async nonMembers(@Param('id', ParseIntPipe) id: number) {
    return this.channelService.getNonMembers(id);
  }

  @Post(':id/members')
  @UseGuards(JwtAccessTokenGuard)
  async addMembers(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
    @Body() data: { members: number[] },
  ) {
    if (!(await this.channelService.isOwner(req.user.id, id)))
      throw new BadRequestException('You are not the owner of this channel');
    return this.channelService.addMembersToChannel(id, data.members);
  }

  @Delete(':id/members/:memberId')
  @UseGuards(JwtAccessTokenGuard)
  async removeMember(
    @Param('id', ParseIntPipe) id: number,
    @Param('memberId', ParseIntPipe) memberId: number,
    @Req() req,
  ) {
    if (!(await this.channelService.isOwner(req.user.id, id)))
      throw new BadRequestException('You are not the owner of this channel');
    return this.channelService.removeMemberFromChannel(id, memberId);
  }

  @Post(':id/join')
  @UseGuards(JwtAccessTokenGuard)
  async joinChannel(@Param('id', ParseIntPipe) id: number, @Req() req) {
    if (await this.channelService.isBanned(req.user.id, id))
      throw new BadRequestException('You are banned from this channel');
    if (await this.channelService.isMember(req.user.id, id))
      throw new BadRequestException('You are already a member of this channel');
    return this.channelService.addMembersToChannel(id, [req.user.id]);
  }

  @Post(':id/leave')
  @UseGuards(JwtAccessTokenGuard)
  async leaveChannel(@Param('id', ParseIntPipe) id: number, @Req() req) {
    if (await this.channelService.isBanned(req.user.id, id))
      throw new BadRequestException('You are banned from this channel');
    if (!(await this.channelService.isMember(req.user.id, id)))
      throw new BadRequestException('You are not a member of this channel');
    if (await this.channelService.isOwner(req.user.id, id))
      throw new BadRequestException('You are the owner of this channel');
    return this.channelService.removeMemberFromChannel(id, req.user.id);
  }

  @Put(':id')
  @UseGuards(JwtAccessTokenGuard)
  async updateChannel(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
    @Body() data: UpdateChannelDto,
  ) {
    if (!(await this.channelService.isOwner(req.user.id, id)))
      throw new BadRequestException('You are not the owner of this channel');
    return this.channelService.updateChannel(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAccessTokenGuard)
  async deleteChannel(@Param('id', ParseIntPipe) id: number, @Req() req) {
    if (!(await this.channelService.isOwner(req.user.id, id)))
      throw new BadRequestException('You are not the owner of this channel');
    return this.channelService.deleteChannel(id, req.user.id);
  }

  @Post(':id/ban')
  @UseGuards(JwtAccessTokenGuard)
  async banMember(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
    @Body() data: { memberId: number },
  ) {
    console.log(data.memberId);
    return this.channelService.banUser(id, req.user.id, data.memberId);
  }

  @Post('auth')
  @UseGuards(JwtAccessTokenGuard)
  async auth(
    @Req() req,
    @Body() data: { channelId: number; password: string },
  ) {
    const passwordState = await this.channelService.checkChannelPassword(
      data.channelId,
      data.password,
    );
    if (passwordState.success != true)
      throw new BadRequestException(passwordState.message);
    else return passwordState;
  }

  @Get('/invites')
  @UseGuards(JwtAccessTokenGuard)
  async getInvites(@Req() req) {
    return this.channelService.getChannelInvites(req.user.id);
  }

  @Post('/invites/:id')
  @UseGuards(JwtAccessTokenGuard)
  async createInvite(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
    @Body() data: { invitee_id: number },
  ) {
    if (!(await this.channelService.isOwner(req.user.id, id)))
      throw new BadRequestException('You are not the owner of this channel');
    return this.channelService.sendInvite(data.invitee_id, id);
  }

  @Post('/invites/:id/accept')
  @UseGuards(JwtAccessTokenGuard)
  async acceptInvite(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.channelService.acceptInvite(req.user.id, id);
  }

  @Post('/promote/:id')
  @UseGuards(JwtAccessTokenGuard)
  async promoteMember(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
    @Body() data: { memberId: number },
  ) {
    if (!(await this.channelService.isOwner(req.user.id, id)))
      throw new BadRequestException('You are not the owner of this channel');
    return this.channelService.promoteUser(id, data.memberId);
  }

  @Post('/demote/:id')
  @UseGuards(JwtAccessTokenGuard)
  async demoteMember(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
    @Body() data: { memberId: number },
  ) {
    if (!(await this.channelService.isOwner(req.user.id, id)))
      throw new BadRequestException('You are not the owner of this channel');
    return this.channelService.demoteUser(id, data.memberId);
  }
}
