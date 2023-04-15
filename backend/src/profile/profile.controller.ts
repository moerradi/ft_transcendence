import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAccessTokenGuard } from 'src/auth/guards/jwtaccess.guard';
import takeSkipDto from './dto/takeSkip.dto';
import { userPayload } from 'src/auth/types/userPayload';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { ProfileUpdateDto } from './dto/profile-update.dto';
import LoginDto from './dto/login.dto';
import { ApiResponse } from '@nestjs/swagger';

const avatarInterceptor = FileInterceptor('avatar', {
  storage: diskStorage({
    destination: join(__dirname, '..', '..', 'public', 'images'),
    filename: (req, file, callback) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return callback(
          new BadRequestException('Only image files are allowed!'),
          null,
        );
      }
      const name = file.originalname.split('.')[0];
      const fileExtName = extname(file.originalname);
      callback(null, `${name}-${Date.now()}${fileExtName}`);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
});

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':login/info')
  @UseGuards(JwtAccessTokenGuard)
  async getProfile(
    @Req() req: Request & { user: userPayload },
    @Param('login') login: string,
  ) {
    const profile = await this.profileService.getProfile(req.user.id, login);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

  @Get(':login/matches')
  @UseGuards(JwtAccessTokenGuard)
  async getProfileMatches(
    @Param('login') login: string,
    @Query() { take, skip }: takeSkipDto,
  ) {
    const profile = await this.profileService.getProfileMatches(
      login,
      take,
      skip,
    );
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

  @Get('search')
  @UseGuards(JwtAccessTokenGuard)
  async searchProfiles(@Query('q') query: string) {
    if (!query) return [];
    return await this.profileService.searchProfiles(query);
  }

  @Get('settings')
  @UseGuards(JwtAccessTokenGuard)
  @ApiResponse({
    status: 200,
    description: 'User settings',
    type: ProfileUpdateDto,
  })
  async getProfileSettings(@Req() req: Request & { user: userPayload }) {
    const settings = await this.profileService.getProfileSettings(req.user.id);
    if (!settings) {
      throw new BadRequestException(
        "User doesn't exist ?! WTF you tryna do ?!",
      );
    }
    return settings;
  }

  @Post('update')
  @UseGuards(JwtAccessTokenGuard)
  @UseInterceptors(avatarInterceptor)
  async updateProfile(
    @Req() req: Request & { user: userPayload },
    @UploadedFile() file,
    @Body() profileUpdateDto: ProfileUpdateDto,
  ) {
    if (file) {
      profileUpdateDto.avatar_url = `/images/${file.filename}`;
    }
    return this.profileService.updateProfileSettings(
      req.user.id,
      profileUpdateDto,
    );
  }

  @Post('update/login')
  @UseGuards(JwtAccessTokenGuard)
  async updateProfileLogin(
    @Req() req: Request & { user: userPayload },
    @Body() loginDto: LoginDto,
  ) {
    return this.profileService.updateProfileLogin(req.user.id, loginDto.login);
  }

  @Post('update/avatar')
  @UseGuards(JwtAccessTokenGuard)
  @UseInterceptors(avatarInterceptor)
  async updateProfileAvatar(
    @Req() req: Request & { user: userPayload },
    @UploadedFile() file,
  ) {
    if (file) {
      return this.profileService.updateProfileAvatar(
        req.user.id,
        `/images/${file.filename}`,
      );
    }
    throw new BadRequestException('No file provided');
  }

  @Get('all')
  @UseGuards(JwtAccessTokenGuard)
  async getAllProfiles(
    @Req() req: Request & { user: userPayload },
    @Query() { take, skip }: takeSkipDto,
  ) {
    return await this.profileService.getAllProfiles(take, skip);
  }
}
