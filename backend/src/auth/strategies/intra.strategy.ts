import { Strategy } from 'passport-oauth2';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy, 'intra42') {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    super({
      authorizationURL: configService.get('INTRA_AUTH_URL'),
      tokenURL: configService.get('INTRA_TOKEN_URL'),
      clientID: configService.get('INTRA_CLIENT_ID'),
      clientSecret: configService.get('INTRA_CLIENT_SECRET'),
      callbackURL: configService.get('INTRA_CALLBACK_URL'),
      scope: configService.get('INTRA_SCOPE'),
      skipUserProfile: true,
    });
  }

  async validate(accessToken: string) {
    const { data } = await firstValueFrom(
      this.httpService
        .get(this.configService.get('INTRA_USER_URL'), {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .pipe(
          catchError((err: AxiosError) => {
            console.log(err);
            throw err;
          }),
        ),
    );
    return data;
  }
}
