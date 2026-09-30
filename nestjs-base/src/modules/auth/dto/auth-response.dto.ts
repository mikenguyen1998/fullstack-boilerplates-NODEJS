import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

export class TokensDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty({ example: 'Bearer' })
  tokenType: 'Bearer';

  @ApiProperty({ example: '15m' })
  expiresIn: string;
}

export class AuthResponseDto extends TokensDto {
  @ApiProperty({ type: () => User })
  user: User;
}
