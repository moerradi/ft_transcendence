import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
  imports: [
    PrismaModule,
    MulterModule.register({
      dest: '../public/images',
    }),
  ],
})
export class ProfileModule {}
