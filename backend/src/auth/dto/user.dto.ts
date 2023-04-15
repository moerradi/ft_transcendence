import { ApiProperty } from '@nestjs/swagger';

class UserDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  login: string;
  @ApiProperty()
  intra_id: number;
  @ApiProperty()
  first_name: string;
  @ApiProperty()
  last_name: string;
  @ApiProperty()
  avatar_url: string;
  @ApiProperty()
  two_factor_auth_enabled: boolean;
}

export default UserDto;
