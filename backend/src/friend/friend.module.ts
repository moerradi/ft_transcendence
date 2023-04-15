import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GameModule } from 'src/game/game.module';

@Module({
  controllers: [FriendController],
  providers: [FriendService],
  imports: [PrismaModule, GameModule],
})
export class FriendModule {}
