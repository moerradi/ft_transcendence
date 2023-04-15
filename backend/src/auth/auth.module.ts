import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { IntraStrategy } from './strategies/intra.strategy';
import { PassportModule } from '@nestjs/passport';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { jwtAccessTokenStrategy } from './strategies/jwtaccess.strategy';
import { WsGuard } from './guards/socket.guard';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService, IntraStrategy, jwtAccessTokenStrategy, WsGuard],
  imports: [
    PrismaModule,
    PassportModule,
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
    JwtModule.registerAsync({
      useFactory: () => ({}),
    }),
	ConfigModule
  ],
})
export class AuthModule {}
