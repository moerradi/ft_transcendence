import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, Length } from 'class-validator';

class twoFaDto {
  @ApiProperty()
  @IsNumberString()
  @Length(6, 6)
  code: string;
}

export default twoFaDto;
