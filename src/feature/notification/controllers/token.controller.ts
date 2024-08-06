import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/core/decorators';
import { Pagination, Role } from 'src/shared';
import { SendTokenDto, VerifyTokenDto } from '../dtos';
import { Token } from '../entities/token.entity';
import { ITokenService } from '../interfaces';

@ApiTags('token')
@ApiBearerAuth()
@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: ITokenService) {}

  @Post('send-token')
  @ApiOperation({ summary: 'Generate and send an email token' })
  @ApiResponse({ status: 201, description: 'Token sent successfully' })
  async sendToken(@Body() body: SendTokenDto): Promise<void> {
    await this.tokenService.create(body.email, '');
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all tokens with pagination' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of tokens per page',
  })
  @ApiQuery({
    name: 'email',
    required: false,
    type: String,
    description: 'Email to serach for tokens',
  })
  @ApiResponse({
    status: 200,
    description: 'List of tokens with pagination.',
    type: Pagination<Token>,
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('email') email: string,
  ): Promise<Pagination<Token[]>> {
    return this.tokenService.findAll(page, limit, email);
  }

  @Post('verify-token')
  @ApiOperation({ summary: 'Verify an email token' })
  @ApiResponse({ status: 202, description: 'Token is valid' })
  @ApiResponse({ status: 404, description: 'Token not found' })
  @ApiResponse({ status: 400, description: 'Token has expired' })
  async verifyToken(@Body() body: VerifyTokenDto): Promise<void> {
    this.tokenService.verifyToken(body.token);
  }
}
