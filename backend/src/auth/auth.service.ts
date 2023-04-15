import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { IntraUser } from 'src/types';
import * as speakeasy from 'speakeasy';
import { userPayload } from './types/userPayload';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  private tempSecrets = new Map<number, string>();

  async validateUser(user: IntraUser) {
    const { login, first_name, last_name, id, image } = user;
    const existingUser = await this.prisma.user.findUnique({
      where: {
        intra_id: id,
      },
    });
    if (!existingUser) {
      const newUser = await this.prisma.user.create({
        data: {
          intra_id: id,
          login,
          first_name,
          last_name,
          avatar_url: image.versions.medium,
        },
      });
      return { user: newUser, firstLogin: true };
    }
    return { user: existingUser, firstLogin: false };
  }

  async createAccessToken(user: userPayload, twofa: boolean) {
    const accessToken = this.jwtService.sign(
      {
        id: user.id,
        login: user.login,
        twofa,
      },
      {
        expiresIn: twofa ? '5m' : '3d',
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      },
    );
    return accessToken;
  }

  async signUser(user: userPayload, twofa: boolean) {
    const accessToken = await this.createAccessToken(user, twofa);
    return { accessToken };
  }

  generate2FASecret() {
    const secret = speakeasy.generateSecret({
      name: 'Transcendence',
      length: 20,
    });
    return {
      base32: secret.base32,
      otpauth: secret.otpauth_url,
    };
  }

  validate2FAToken(secret: string, token: string) {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
    });
  }

  generate2FArecoveryCodes() {
    const codes = [];
    for (let i = 0; i < 10; i++) {
      codes.push(speakeasy.generateSecret({ length: 20 }).base32);
    }
    return codes;
  }

  async enable2FA(userId: number) {
    const { base32, otpauth } = this.generate2FASecret();
    // add recovery codes generation later
    this.tempSecrets.set(userId, base32);
    return { qrcode: otpauth };
  }

  async confirm2FA(userId: number, code: string) {
    const tmpSecret = this.tempSecrets.get(userId);
    if (!tmpSecret) {
      throw new UnauthorizedException('2FA not enabled');
    }
    const isValid = this.validate2FAToken(tmpSecret, code);
    if (isValid) {
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          two_factor_auth_enabled: true,
          two_factor_auth_secret: tmpSecret,
        },
      });
      this.tempSecrets.delete(userId);
    }
    return isValid;
  }

  async disable2FA(userId: number) {
    try {
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          two_factor_auth_enabled: false,
          two_factor_auth_secret: null,
        },
      });
      return { success: true, message: '2FA disabled successfully' };
    } catch (e) {
      throw new BadRequestException("Couldn't disable 2FA");
    }
  }

  async verify2FA(userId: number, code: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (
      !user ||
      !user.two_factor_auth_enabled ||
      !user.two_factor_auth_secret
    ) {
      throw new BadRequestException('2FA is not enabled for this user.');
    }
    const isValid = this.validate2FAToken(user.two_factor_auth_secret, code);
    return isValid;
  }

  async getMe(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (user) return user;
    else
      throw new UnauthorizedException(
        'something went wrong, please login again',
      );
  }
}
