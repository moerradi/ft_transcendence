import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HomeService {
  constructor(private prisma: PrismaService) {}

  async getHome() {
    // get most popular public chatrooms
    const chatrooms = await this.prisma.channel.findMany({
      where: {
        type: 'PUBLIC',
      },
      orderBy: {
        users: {
          _count: 'desc',
        },
      },
      take: 5,
      select: {
        id: true,
        name: true,
      },
    });
    // get top 6 players by level and exp
    const users = await this.prisma.user.findMany({
      orderBy: {
        level: 'desc',
        exp: 'desc',
      },
      take: 6,
      select: {
        id: true,
        login: true,
        avatar_url: true,
        level: true,
      },
    });
    return { chatrooms, users };
  }
}
