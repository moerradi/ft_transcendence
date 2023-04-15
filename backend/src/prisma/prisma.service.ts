import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

function calculateNewLevel(exp: number): number {
  const baseExp = 100;
  const levelMultiplier = 1.5;

  let level = 0;
  let requiredExp = 0;

  while (exp >= requiredExp) {
    level++;
    requiredExp += Math.floor(baseExp * Math.pow(levelMultiplier, level - 1));
  }

  return level;
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
    this.$use(async (params, next) => {
      // when updating a user, we want to update the level based on the new exp
      if (params.model === 'User' && params.action === 'update') {
        const { exp } = params.args.data;
        console.log('exp', exp);
        if (exp) {
          if (exp.increment) {
            // get old exp
            const oldExp = await this.user.findUnique({
              where: { id: params.args.where.id },
              select: { exp: true },
            });
            params.args.data.level = calculateNewLevel(
              exp.increment + oldExp.exp,
            );
          } else {
            console.log('set', exp.set);
            params.args.data.level = calculateNewLevel(exp.set);
          }
        }
      }
      return next(params);
    });
    console.log('Prisma connected');
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
