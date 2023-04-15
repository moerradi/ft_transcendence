import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ChannelGateway } from './channel.gateway';

@Module({
  controllers: [ChannelController],
  providers: [ChannelService, ChannelGateway],
  imports: [PrismaModule],
})
export class ChannelModule {}
