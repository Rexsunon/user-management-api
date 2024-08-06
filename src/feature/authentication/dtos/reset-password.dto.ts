import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'The new password',
    example: 'newPassword123',
  })
  @IsString()
  @MinLength(8)
  newPassword: string;
}
