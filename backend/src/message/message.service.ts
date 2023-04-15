import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  async getMessages(from: number, to: number) {
    return await this.prisma.direct_message.findMany({
      where: {
        OR: [
          {
            author_id: from,
            recipient_id: to,
          },
          {
            author_id: to,
            recipient_id: from,
          },
        ],
      },
      include: {
        author: {
          select: {
            login: true,
            id: true,
            avatar_url: true,
          },
        },
      },
      orderBy: {
        sent_at: 'asc',
      },
    });
  }

  async getFriends(id: number) {
    const friends = await this.prisma.user.findUnique({
      where: { id },
      include: {
        sent_requests: {
          where: {
            status: 'ACCEPTED',
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
        },
        received_requests: {
          where: {
            status: 'ACCEPTED',
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
        },
      },
    });
    if (!friends) {
      throw new BadRequestException(`User with id "${id}" not found`);
    }

    return [
      ...friends.sent_requests.map((friendship: any) => friendship.addressee),
      ...friends.received_requests.map(
        (friendship: any) => friendship.requester,
      ),
    ];
  }
}
