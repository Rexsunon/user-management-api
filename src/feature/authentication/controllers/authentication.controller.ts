import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/feature/user-management/dtos';
import { ForgotPasswordDto, LoginDto, ResetPasswordDto } from '../dtos';
import { IAuthenticationService } from '../interfaces/authentication.interface';

@ApiTags('authentication')
@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authService: IAuthenticationService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiResponse({
    status: 201,
    description: 'User has been created successfully.',
  })
  async signup(@Body() createUserDto: CreateUserDto): Promise<any> {
    await this.authService.signup(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Log in an existing user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in.' })
  async login(@Body() loginDto: LoginDto): Promise<any> {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Forgot password' })
  @ApiResponse({ status: 200, description: 'Password reset email sent.' })
  async forgotPassword(@Body() body: ForgotPasswordDto): Promise<void> {
    return this.authService.forgotPassword(body.email);
  }

  @Post('reset-password/:token')
  @ApiOperation({ summary: 'Reset password' })
  @ApiResponse({ status: 202, description: 'Password successfully reset.' })
  async resetPassword(
    @Param('token') token: string,
    @Body() body: ResetPasswordDto,
  ): Promise<void> {
    return this.authService.resetPassword(token, body.newPassword);
  }
}
