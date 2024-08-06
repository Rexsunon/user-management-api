import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    name: 'firstname',
    type: String,
    required: true,
    description: 'The first name of the register user',
  })
  @IsString()
  @IsNotEmpty()
  readonly firstname: string;

  @ApiProperty({
    name: 'lastname',
    type: String,
    required: true,
    description: 'The last name of the register user',
  })
  @IsString()
  @IsNotEmpty()
  readonly lastname: string;

  @ApiProperty({
    name: 'email',
    type: String,
    required: true,
    description: 'The email address of the register user',
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiPropertyOptional({
    name: 'otp',
    type: String,
    description: 'OTP verification code',
  })
  @IsString()
  @IsOptional()
  readonly otp?: string;

  @ApiProperty({
    name: 'password',
    type: String,
    required: true,
    description: 'The password of the register user account',
  })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
