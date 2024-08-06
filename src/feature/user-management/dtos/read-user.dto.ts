import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/shared';

export class ReadUserDto {
  @ApiProperty({
    type: String,
    description: 'User Id',
  })
  readonly id: string;

  @ApiProperty({
    type: String,
    description: 'The first name of the registered user',
  })
  readonly firstname: string;

  @ApiProperty({
    type: String,
    description: 'The last name of the registered user',
  })
  readonly lastname: string;

  @ApiProperty({
    type: String,
    description: 'The email address of the registered user',
  })
  readonly email: string;

  @ApiProperty({
    type: [String],
    description: 'User roles',
    enum: Role,
  })
  readonly roles: Role[];
}
