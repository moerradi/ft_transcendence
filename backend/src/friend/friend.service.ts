import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { GameGateway } from 'src/game/game.gateway';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FriendService {
  constructor(private prisma: PrismaService, private gateway: GameGateway) {}

  async getFriends(login: string): Promise<User[]> {
    const user = await this.prisma.user.findUnique({
      where: { login },
      include: {
        sent_requests: {
          where: { status: 'ACCEPTED' },
          select: {
            addressee: {
              select: {
                id: true,
                login: true,
                avatar_url: true,
              },
            },
          },
        },
        received_requests: {
          where: { status: 'ACCEPTED' },
          select: {
            requester: {
              select: {
                id: true,
                login: true,
                avatar_url: true,
              },
            },
          },
        },
      },
    });
    if (!user) {
      throw new BadRequestException(`User with login "${login}" not found`);
    }

    const friends = [
      ...user.sent_requests.map((friendship: any) => friendship.addressee),
      ...user.received_requests.map((friendship: any) => friendship.requester),
    ].map((friend) => ({
      ...friend,
      status: this.gateway.status(friend.id),
    }));

    return friends;
  }

  async getFriendRequests(userId: number) {
    const friendships = await this.prisma.friendship.findMany({
      where: {
        addressee_id: userId,
        status: 'PENDING',
      },
      select: {
        requester: {
          select: {
            id: true,
            login: true,
            avatar_url: true,
          },
        },
      },
    });
    return friendships.map((friendship: any) => friendship.requester);
  }

  async getSentFriendRequests(userId: number) {
    const fiendships = await this.prisma.friendship.findMany({
      where: {
        requester_id: userId,
        status: 'PENDING',
      },
      select: {
        addressee: {
          select: {
            id: true,
            login: true,
            avatar_url: true,
          },
        },
      },
    });
    return fiendships.map((friendship: any) => friendship.addressee);
  }

  async sendFriendRequest(userId: number, addressee: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new BadRequestException(`User with id "${userId}" not found`);
    }
    const addresseeUser = await this.prisma.user.findUnique({
      where: { login: addressee },
    });
    if (!addresseeUser) {
      throw new BadRequestException(`User with login "${addressee}" not found`);
    }
    if (addresseeUser.id === userId) {
      throw new BadRequestException(
        `You can't send friend request to yourself`,
      );
    }
    const friendship = await this.prisma.friendship.findFirst({
      where: {
        OR: [
          {
            requester_id: userId,
            addressee_id: addresseeUser.id,
          },
          {
            requester_id: addresseeUser.id,
            addressee_id: userId,
          },
        ],
      },
    });
    if (friendship) {
      throw new BadRequestException(`Friendship already exists`);
    }
    try {
      await this.prisma.friendship.create({
        data: {
          requester_id: userId,
          addressee_id: addresseeUser.id,
          status: 'PENDING',
        },
      });
    } catch (e) {
      console.log(e);
      throw new BadRequestException(`Something went wrong`);
    }
    return { success: true };
  }

  async acceptFriendRequest(addressee_id: number, login: string) {
    // get friend id
    const requester = await this.prisma.user.findUnique({
      where: {
        login,
      },
    });
    if (!requester) {
      throw new BadRequestException(`User with login "${login}" not found`);
    }
    const friendship = await this.prisma.friendship.findUnique({
      where: {
        friendship_id: {
          requester_id: requester.id,
          addressee_id,
        },
      },
    });
    if (!friendship) {
      throw new BadRequestException(`Friendship not found`);
    } else if (friendship.status === 'ACCEPTED') {
      throw new BadRequestException(`Friendship already accepted`);
    }
    try {
      await this.prisma.friendship.update({
        where: {
          friendship_id: {
            requester_id: requester.id,
            addressee_id,
          },
        },
        data: {
          status: 'ACCEPTED',
        },
      });
    } catch (e) {
      console.log(e);
      throw new BadRequestException(`Something went wrong`);
    }
    return { success: true };
  }

  async deleteFriendRequest(addressee_id: number, login: string) {
    const requester = await this.prisma.user.findUnique({
      where: {
        login,
      },
    });
    if (!requester) {
      throw new BadRequestException(`User with login "${login}" not found`);
    }

    const friendship = await this.prisma.friendship.findUnique({
      where: {
        friendship_id: {
          requester_id: requester.id,
          addressee_id,
        },
      },
    });
    if (!friendship) {
      throw new BadRequestException(`Friendship not found`);
    }
    try {
      await this.prisma.friendship.delete({
        where: {
          friendship_id: {
            requester_id: requester.id,
            addressee_id,
          },
        },
      });
    } catch (e) {
      console.log(e);
      throw new BadRequestException(`Something went wrong`);
    }
    return { success: true };
  }

  async unfriend(addressee_id: number, login: string) {
    const requester = await this.prisma.user.findUnique({
      where: {
        login,
      },
    });
    if (!requester) {
      throw new BadRequestException(`User with login "${login}" not found`);
    }
    const friendship = await this.prisma.friendship.findFirst({
      where: {
        OR: [
          {
            requester_id: requester.id,
            addressee_id: addressee_id,
          },
          {
            requester_id: addressee_id,
            addressee_id: requester.id,
          },
        ],
      },
    });
    if (!friendship) {
      throw new BadRequestException(`Friendship not found`);
    }
    try {
      await this.prisma.friendship.delete({
        where: {
          friendship_id: {
            requester_id: friendship.requester_id,
            addressee_id: friendship.addressee_id,
          },
        },
      });
    } catch (e) {
      console.log(e);
      throw new BadRequestException(`Something went wrong`);
    }
    return { suceess: true };
  }

  async blockFriend(requester_id: number, login: string) {
    const toblock = await this.prisma.user.findUnique({
      where: {
        login: login,
      },
    });
    if (!toblock) {
      throw new BadRequestException(`User with login "${login}" not found`);
    }
    const friendship = await this.prisma.friendship.findFirst({
      where: {
        OR: [
          {
            requester_id: requester_id,
            addressee_id: toblock.id,
          },
          {
            requester_id: toblock.id,
            addressee_id: requester_id,
          },
        ],
      },
    });
    if (friendship && friendship.status === 'BLOCKED') {
      throw new BadRequestException(`Friendship already blocked`);
    }
    try {
      if (friendship) {
        await this.prisma.friendship.update({
          where: {
            friendship_id: {
              requester_id: friendship.requester_id,
              addressee_id: friendship.addressee_id,
            },
          },
          data: {
            requester_id: requester_id,
            addressee_id: toblock.id,
            status: 'BLOCKED',
          },
        });
      } else {
        await this.prisma.friendship.create({
          data: {
            requester_id: requester_id,
            addressee_id: toblock.id,
            status: 'BLOCKED',
          },
        });
      }
    } catch (e) {
      console.log(e);
      throw new BadRequestException(`Something went wrong`);
    }
    return { suceess: true };
  }

  async unblockFriend(requester_id: number, login: string) {
    const toUnblock = await this.prisma.user.findUnique({
      where: {
        login: login,
      },
    });
    if (!toUnblock) {
      throw new BadRequestException(`User with login "${login}" not found`);
    }
    const friendship = await this.prisma.friendship.findFirst({
      where: {
        OR: [
          {
            requester_id: requester_id,
            addressee_id: toUnblock.id,
          },
          {
            requester_id: toUnblock.id,
            addressee_id: requester_id,
          },
        ],
      },
    });
    if (!friendship) {
      throw new BadRequestException(`Friendship not found`);
    } else if (friendship.status !== 'BLOCKED') {
      throw new BadRequestException(`Friendship not blocked`);
    }
    try {
      await this.prisma.friendship.delete({
        where: {
          friendship_id: {
            requester_id: friendship.requester_id,
            addressee_id: friendship.addressee_id,
          },
        },
      });
      return { suceess: true };
    } catch (e) {
      console.log(e);
      throw new BadRequestException(`Something went wrong`);
    }
  }
}
