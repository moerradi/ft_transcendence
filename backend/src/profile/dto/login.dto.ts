import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export default class LoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  login: string;
}
