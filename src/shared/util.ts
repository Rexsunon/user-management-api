import { ReadUserDto } from 'src/feature/user-management/dtos';
import { User } from 'src/feature/user-management/entities';

export const toReadUserDto = (user: User): ReadUserDto => {
  return {
    id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    roles: user.roles,
  };
};
