import { ChannelType } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateChannelDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsEnum(ChannelType)
  type: ChannelType;
  @IsString()
  @IsOptional()
  password?: string;
  @IsString()
  @IsOptional()
  icon_url?: string;
  users?: number[];
}

export class UpdateChannelDto {
  @IsString()
  @IsOptional()
  name?: string;
  @IsString()
  @IsOptional()
  password?: string;
  @IsEnum(ChannelType)
  @IsOptional()
  type: ChannelType;
}
