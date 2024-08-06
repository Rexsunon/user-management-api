import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyTokenDto {
  @ApiProperty({
    description: 'The token to verify the email address',
    example: '037823',
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}
