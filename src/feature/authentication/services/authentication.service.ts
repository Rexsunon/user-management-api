import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ITokenService } from 'src/feature/notification/interfaces';
import { CreateUserDto } from 'src/feature/user-management/dtos';
import { User, UserDocument } from 'src/feature/user-management/entities';
import { toReadUserDto } from 'src/shared/util';
import { IAuthenticationService } from '../interfaces/authentication.interface';
import { IUserManagementService } from 'src/feature/user-management/interfaces';

@Injectable()
export class AuthenticationService implements IAuthenticationService {
  /**
   * Creates an instance of AuthenticationService.
   *
   * @param userModel - The Mongoose model for the User entity.
   * @param userManagementService - Service for user management operations.
   * @param jwtService - Service for handling JSON Web Tokens.
   * @param tokenService - Service for handling token-based operations, such as password reset tokens.
   */
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly userManagementService: IUserManagementService,
    private readonly jwtService: JwtService,
    private readonly tokenService: ITokenService,
  ) {}

  /**
   * Handles user signup by creating a new user.
   *
   * @param createUserDto - Data transfer object containing user information for registration.
   * @returns A promise that resolves when the user has been successfully created.
   */
  async signup(createUserDto: CreateUserDto): Promise<void> {
    await this.userManagementService.create(createUserDto);
  }

  /**
   * Handles user login by validating credentials and generating a JWT.
   *
   * @param email - The email address of the user trying to log in.
   * @param password - The password of the user trying to log in.
   * @returns A promise that resolves with user data and a JWT if credentials are valid.
   * @throws BadRequestException if the credentials are invalid.
   */
  async login(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      throw new BadRequestException('Invalid credentials');
    }

    // TODO implement cookie cache for token.
    const payload = { id: user.id, email: user.email, roles: user.roles };
    const token = this.jwtService.sign(payload, { algorithm: 'ES512' });

    return { user: toReadUserDto(user), token };
  }

  /**
   * Initiates a password reset process by sending a reset token or link to the user's email.
   *
   * @param email - The email address of the user who requested a password reset.
   * @returns A promise that resolves when the reset token or link has been sent.
   * @throws NotFoundException if the user with the provided email does not exist.
   */
  async forgotPassword(email: string): Promise<any> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    // Send password reset email with a token or link
    // Implement password reset logic here
    await this.tokenService.create(email, 'Forgot password');
  }

  /**
   * Resets the user's password using a provided OTP (One-Time Password) and the new password.
   *
   * @param newPassword - The new password to set for the user.
   * @param otp - The OTP used to verify the password reset request.
   * @returns A promise that resolves when the password has been successfully reset.
   * @throws NotFoundException if the user with the provided email does not exist.
   * @throws BadRequestException if the OTP is invalid.
   */
  async resetPassword(newPassword: string, otp: string): Promise<void> {
    const token = await this.tokenService.findOne(otp);
    if (!token) {
      await this.tokenService.verifyToken(otp);
    }

    const email = token.email;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    user.password = newPassword;
    user.save();
  }
}
