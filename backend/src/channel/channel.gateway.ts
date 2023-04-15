import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { userPayload } from 'src/auth/types/userPayload';
import { Channel, User } from '@prisma/client';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ChannelService } from './channel.service';

interface mutedUntil {
  mutedUntil: number;
  userId: number;
}

@Injectable()
@WebSocketGateway({ namespace: '/chat', cors: true })
export class ChannelGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private prismaservice: PrismaService,
    private configService: ConfigService,
    private channelService: ChannelService,
  ) {
    console.log('ChatGateway');
  }

  public mutedUsers = new Map<number, mutedUntil[]>();

  @WebSocketServer() server: Server;

  afterInit() {
    Logger.log('Initialized!');
  }
  async handleConnection(client: Socket & { userData: Partial<User> }) {
    try {
      if (!client.handshake.auth.token) {
        client.disconnect();
        return;
      }

      const { login, id, twofa } = jwt.verify(
        client.handshake.auth.token,
        this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      ) as userPayload;
      if (twofa) {
        client.disconnect();
        return;
      }
      const userData = await this.prismaservice.user.findUnique({
        where: { id },
        select: {
          id: true,
          login: true,
          avatar_url: true,
        },
      });
      if (!userData) {
        client.disconnect();
        return;
      }
      client.userData = userData;
    } catch (ex) {
      console.error(ex);
      client.disconnect();
      return;
    }
    console.log(`Client connected to chat: ${client.userData.id}`);
  }

  handleDisconnect(client: Socket & { userData: Partial<User> }) {
    // console.log(`Client disconnected from chat: ${client.userData.id}`);
  }

  @SubscribeMessage('channel:message')
  async handleMessage(
    client: Socket & {
      userData: Partial<User>;
      currentChannel: Partial<Channel>;
    },
    payload: any,
  ) {
    const muted = this.mutedUsers.get(client.userData.id);
    if (muted) {
      const mutedUntil = muted.find(
        (muted) => muted.userId === client.userData.id,
      );
      if (mutedUntil) {
        if (mutedUntil.mutedUntil > Date.now()) {
          return;
        } else {
          muted.splice(muted.indexOf(mutedUntil), 1);
        }
      }
    }
    // GET USER BY ID
    // @TODO: verify that user can send message to channel
    if (payload.message == '') {
      return;
    }
    await this.prismaservice.channel_message.create({
      data: {
        channel_id: payload.id,
        author_id: client.userData.id,
        content: payload.message,
      },
    });
    this.server.to(payload.id.toString()).emit('channel:message', {
      channel_id: payload.id,
      author_id: client.userData.id,
      content: payload.message,
      sent_at: new Date(),
      author: {
        login: client.userData.login,
        avatar_url: client.userData.avatar_url,
      },
    });
  }

  @SubscribeMessage('channel:join')
  async handleJoin(
    client: Socket & {
      userData: Partial<User>;
      currentChannel: Partial<Channel>;
    },
    payload: { channel_id: number; password: string },
  ) {
    client.currentChannel = await this.prismaservice.channel.findUnique({
      where: { id: payload.channel_id },
      select: {
        id: true,
        name: true,
        type: true,
      },
    });
    // check if user is in channel
    const userInChannel = await this.prismaservice.channel_user.findFirst({
      where: {
        channel_id: payload.channel_id,
        user_id: client.userData.id,
      },
    });
    if (client.currentChannel.type == 'PROTECTED') {
      const isPasswordCorrect = await this.channelService.checkChannelPassword(
        payload.channel_id,
        payload.password,
      );
      if (!isPasswordCorrect.success) {
        return;
      }
      if (!userInChannel) {
        await this.prismaservice.channel_user.create({
          data: {
            channel_id: payload.channel_id,
            user_id: client.userData.id,
            status: 'MEMBER',
          },
        });
      }
    } else if (!userInChannel && client.currentChannel.type == 'PUBLIC') {
      await this.prismaservice.channel_user.create({
        data: {
          channel_id: payload.channel_id,
          user_id: client.userData.id,
          status: 'MEMBER',
        },
      });
    } else if (!userInChannel && client.currentChannel.type == 'PRIVATE') {
      return;
    }
    if (userInChannel && userInChannel.status == 'BANNED') {
      return;
    }
    console.log(client.userData, 'joined channel', payload.channel_id);
    client.join(payload.channel_id.toString());
  }

  @SubscribeMessage('channel:leave')
  handleLeave(client: Socket, payload: number) {
    client.leave(payload.toString());
  }

  @SubscribeMessage('channel:mute')
  async handleMute(
    client: Socket & {
      userData: Partial<User>;
      currentChannel: Partial<Channel>;
    },
    payload: { channel_id: number; user_id: number; time: number },
  ) {
    const userInChannel = await this.prismaservice.channel_user.findFirst({
      where: {
        channel_id: payload.channel_id,
        user_id: client.userData.id,
      },
    });
    if (!userInChannel) {
      return;
    }
    if (userInChannel.status != 'OWNER' && userInChannel.status != 'ADMIN') {
      return;
    }
    // target user
    const targetUser = await this.prismaservice.user.findUnique({
      where: {
        id: payload.user_id,
      },
    });
    if (!targetUser) {
      return;
    }
    // check if user is in channel
    const targetUserInChannel = await this.prismaservice.channel_user.findFirst(
      {
        where: {
          channel_id: payload.channel_id,
          user_id: targetUser.id,
        },
      },
    );
    if (!targetUserInChannel) {
      return;
    }
    // check if targetuse isowner
    if (targetUserInChannel.status == 'OWNER') {
      return;
    }
    // check if targetuser is admin
    if (
      targetUserInChannel.status == 'ADMIN' &&
      userInChannel.status != 'OWNER'
    ) {
      return;
    }
    // ADD TO MUTED USERS
    const muted = this.mutedUsers.get(payload.channel_id);
    if (muted) {
      muted.push({
        userId: targetUser.id,
        mutedUntil: Date.now() + payload.time,
      });
    } else {
      this.mutedUsers.set(payload.channel_id, [
        {
          userId: targetUser.id,
          mutedUntil: Date.now() + payload.time,
        },
      ]);
    }
    // SEND TO CHANNEL
    this.server.to(payload.channel_id.toString()).emit('channel:mute', {
      channel_id: payload.channel_id,
      user_id: targetUser.id,
      time: payload.time,
    });
    // also store in db
    await this.prismaservice.channel_user.update({
      where: {
        cid: {
          channel_id: payload.channel_id,
          user_id: targetUser.id,
        },
      },
      data: {
        muted_until_time: new Date(Date.now() + payload.time),
      },
    });
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleMutedUsers() {
    this.mutedUsers.forEach((arr, channelId) => {
      arr.forEach((mutedUser, index) => {
        if (mutedUser.mutedUntil < Date.now()) {
          this.server.to(channelId.toString()).emit('channel:unmute', {
            channel_id: channelId,
            user_id: mutedUser.userId,
          });
          arr.splice(index, 1);
        }
      });
    });
  }

  dmRoomId(id1: number, id2: number) {
    return [id1, id2].sort((a, b) => a - b).join('-');
  }

  @SubscribeMessage('dms:join')
  async handleDMJoin(
    client: Socket & {
      userData: Partial<User>;
    },
    payload: number,
  ) {
    client.join(this.dmRoomId(client.userData.id, payload));
  }

  @SubscribeMessage('dms:leave')
  handleDMLeave(
    client: Socket & {
      userData: Partial<User>;
    },
    payload: number,
  ) {
    client.leave(this.dmRoomId(client.userData.id, payload));
  }

  @SubscribeMessage('dms:message')
  async handleDMMessage(
    client: Socket & {
      userData: Partial<User>;
    },
    payload: any,
  ) {
    if (payload.message == '') {
      return;
    }
    await this.prismaservice.direct_message.create({
      data: {
        author_id: client.userData.id,
        recipient_id: payload.id,
        content: payload.message,
      },
    });
    this.server
      .to(this.dmRoomId(client.userData.id, payload.id))
      .emit('dms:message', {
        author_id: client.userData.id,
        recipient_id: payload.id,
        content: payload.message,
        sent_at: new Date(),
        author: {
          login: client.userData.login,
          avatar_url: client.userData.avatar_url,
        },
      });
  }
  @SubscribeMessage('channel:ban')
  async handleBan(
    client: Socket & {
      userData: Partial<User>;
    },
    payload: any,
  ) {
    console.log('channel.ban', payload);
    this.server.to(payload.channel_id).emit('message', {
      channel_id: payload.channel_id,
      author_id: client.userData.id,
      content: `${payload.member_login} has been banned from this channel`,
      sent_at: new Date(),
    });
    this.server.emit('channel:ban', {
      channel_id: payload.channel_id,
      user_id: payload.member_id,
    });
  }

  @SubscribeMessage('dms:block')
  async handleBlock(
    client: Socket & {
      userData: Partial<User>;
    },
    payload: any,
  ) {
    console.log('dms.block', payload);
    this.server.emit('dms:block', {
      user_id: payload.user_id,
    });
  }
}
