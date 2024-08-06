import { CreateUserDto } from 'src/feature/user-management/dtos';

export abstract class IAuthenticationService {
  abstract signup(createUserDto: CreateUserDto): Promise<void>;
  abstract login(email: string, password: string): Promise<any>;
  abstract forgotPassword(email: string): Promise<any>;
  abstract resetPassword(newPassword: string, otp: string): Promise<void>;
}
