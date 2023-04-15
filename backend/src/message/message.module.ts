import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [MessageController],
  providers: [MessageService],
  imports: [PrismaModule],
})
export class MessageModule {}
