import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

class GetProfileMatchesDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  take = '100';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  skip = '0';
}

export default GetProfileMatchesDto;
