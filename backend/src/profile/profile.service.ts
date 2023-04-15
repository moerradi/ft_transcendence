import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfileService {
  // add prisma injection
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

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
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new Error(`User with login "${login}" not found`);
    }

    const friends = [
      ...user.sent_requests.map((friendship: any) => friendship.addressee),
      ...user.received_requests.map((friendship: any) => friendship.requester),
    ];

    return friends;
  }

  // add method to get profile by username (only public data)
  async getProfile(userId: number, login: string) {
    const user = await this.prisma.user.findUnique({
      where: { login },
      select: {
        id: true,
        login: true,
        first_name: true,
        last_name: true,
        avatar_url: true,
        exp: true,
        level: true,
      },
    });
    if (!user) return null;
    let friendshipStatus = 'NOT_FRIENDS';
    // get requester user
    const requester = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (requester.login === login) {
      friendshipStatus = 'SELF';
    } else {
      const f = await this.prisma.friendship.findFirst({
        where: {
          OR: [
            {
              requester_id: userId,
              addressee: {
                login: login,
              },
            },
            {
              requester: {
                login: login,
              },
              addressee_id: userId,
            },
          ],
        },
        include: {
          requester: {
            select: {
              login: true,
            },
          },
        },
      });
      if (f) {
        friendshipStatus = f.status;
        if (friendshipStatus === 'BLOCKED' && f.requester.login === login) {
          throw new NotFoundException(`User with login "${login}" is blocked`);
        }
      }
    }
    // calculate win/loss ratio
    const [wins, losses, draws, recentMatches] = await this.prisma.$transaction(
      [
        this.prisma
          .$queryRaw`SELECT COUNT(*) FROM "Match" WHERE ("player_one_id" = ${user.id} AND "player_one_score" > "player_two_score") OR ("player_two_id" = ${user.id} AND "player_two_score" > "player_one_score");`,
        this.prisma
          .$queryRaw`SELECT COUNT(*) FROM "Match" WHERE ("player_one_id" = ${user.id} AND "player_one_score" < "player_two_score") OR ("player_two_id" = ${user.id} AND "player_two_score" < "player_one_score");`,
        this.prisma
          .$queryRaw`SELECT COUNT(*) FROM "Match" WHERE ("player_one_id" = ${user.id} AND "player_one_score" = "player_two_score") OR ("player_two_id" = ${user.id} AND "player_two_score" = "player_one_score");`,
        this.prisma.match.findMany({
          where: {
            OR: [{ player_one_id: user.id }, { player_two_id: user.id }],
          },
          include: {
            player_one: {
              select: {
                id: true,
                login: true,
              },
            },
            player_two: {
              select: {
                id: true,
                login: true,
              },
            },
          },
          orderBy: {
            started_at: 'desc',
          },
          take: 10,
        }),
      ],
    );
    const winsCount = Number(wins[0].count);
    const lossesCount = Number(losses[0].count);
    const drawsCount = Number(draws[0].count);
    const totalMatches = winsCount + lossesCount + drawsCount;
    const winPercentage = totalMatches ? winsCount / totalMatches : 0;
    const lossPercentage = totalMatches ? lossesCount / totalMatches : 0;
    const drawPercentage = totalMatches ? drawsCount / totalMatches : 0;

    // add only exp for player who we are looking at
    const recentMatchesWithExp = recentMatches.map((match) => {
      if (match.player_one.id === user.id) {
        return {
          player_one: match.player_one.login,
          player_two: match.player_two.login,
          player_one_score: match.player_one_score,
          player_two_score: match.player_two_score,
          started_at: match.started_at,
          game_mode: match.game_mode,
          exp: match.player_one_exp,
        };
      } else {
        return {
          player_one: match.player_one.login,
          player_two: match.player_two.login,
          player_one_score: match.player_one_score,
          player_two_score: match.player_two_score,
          started_at: match.started_at,
          game_mode: match.game_mode,
          exp: match.player_two_exp,
        };
      }
    });
    const friends = await this.getFriends(login);
    // console.log('exp',user.exp);
    console.log(winPercentage, lossPercentage, drawPercentage);
    return {
      id: user.id,
      login: user.login,
      first_name: user.first_name,
      last_name: user.last_name,
      avatar_url: user.avatar_url,
      exp: user.exp,
      level: user.level,
      matchHistory: recentMatchesWithExp,
      friends: friends,
      friendship: friendshipStatus,
      winPercentage: winPercentage * 100,
      lossPercentage: lossPercentage * 100,
      drawPercentage: drawPercentage * 100,
    };
  }

  async searchProfiles(searchString: string) {
    return await this.prisma.user.findMany({
      where: {
        OR: [
          {
            first_name: {
              startsWith: searchString,
              mode: 'insensitive',
            },
          },
          {
            last_name: {
              startsWith: searchString,
              mode: 'insensitive',
            },
          },
          {
            login: {
              startsWith: searchString,
              mode: 'insensitive',
            },
          },
        ],
      },
      select: {
        id: true,
        login: true,
        first_name: true,
        last_name: true,
        avatar_url: true,
      },
      orderBy: {
        login: 'asc',
      },
      take: 5,
    });
  }

  async getProfileMatches(login: string, take: string, skip: string) {
    const takeint = parseInt(take);
    const skipint = parseInt(skip);
    const user = await this.prisma.user.findUnique({
      where: { login },
      select: {
        matches_as_player_one: {
          select: {
            id: true,
            player_one_id: true,
            player_two_id: true,
            game_mode: true,
            player_one_score: true,
            player_two_score: true,
            started_at: true,
          },
          orderBy: {
            started_at: 'desc',
          },
          take: takeint,
          skip: skipint,
        },
        matches_as_player_two: {
          select: {
            id: true,
            player_one_id: true,
            player_two_id: true,
            game_mode: true,
            player_one_score: true,
            player_two_score: true,
            started_at: true,
          },
          orderBy: {
            started_at: 'desc',
          },
          take: takeint,
          skip: skipint,
        },
      },
    });
    if (!user) return null;
    const matchHistory = [
      ...user.matches_as_player_one,
      ...user.matches_as_player_two,
    ]
      .sort((a, b) => (a.started_at > b.started_at ? -1 : 1))
      .slice(skipint, skipint + takeint);
    return matchHistory;
  }
  async getProfileSettings(userId: number) {
    return await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        login: true,
        first_name: true,
        last_name: true,
        avatar_url: true,
        two_factor_auth_enabled: true,
      },
    });
  }

  async getAllProfiles(take: string, skip: string) {
    const takeint = parseInt(take);
    const skipint = parseInt(skip);
    return await this.prisma.user.findMany({
      select: {
        id: true,
        login: true,
        first_name: true,
        last_name: true,
        avatar_url: true,
      },
      orderBy: {
        login: 'asc',
      },
      take: takeint,
      skip: skipint,
    });
  }

  async updateProfileSettings(userId: number, data: any) {
    return await this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  async updateProfileAvatar(userId: number, avatar_url: string) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: { avatar_url },
    });
  }
  async updateProfileLogin(userId: number, login: string) {
    // check if login is already taken
    const user = await this.prisma.user.findUnique({
      where: { login },
    });
    if (user) {
      throw new BadRequestException('Login is already taken');
    }
    return await this.prisma.user.update({
      where: { id: userId },
      data: { login },
    });
  }
}
