import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { Roles } from 'src/core/decorators';
import { JwtAuthGuard, RolesGuard } from 'src/core/guards';
import { Pagination, Role } from 'src/shared';
import { CreateUserDto, ReadUserDto, UpdateUserDto } from '../dtos';
import { IUserManagementService } from '../interfaces';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserManagementController {
  constructor(private readonly userManagementService: IUserManagementService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been created successfully.',
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<void> {
    await this.userManagementService.create(createUserDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all users with pagination' })
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
    description: 'Number of users per page',
  })
  @ApiResponse({
    status: 200,
    description: 'List of users with pagination.',
    type: Pagination<ReadUserDto[]>,
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Pagination<ReadUserDto[]>> {
    return this.userManagementService.findAll(page, limit);
  }

  @Get('profile')
  @Roles(Role.ADMIN, Role.USER)
  @ApiOperation({ summary: 'Get a user profile' })
  @ApiResponse({
    status: 200,
    description: 'The user profile.',
    type: ReadUserDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async profile(@Request() req: ExpressRequest): Promise<ReadUserDto> {
    const user = req.user as { id: string };
    return this.userManagementService.findOne(user.id);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.USER)
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the user to update' })
  @ApiResponse({ status: 202 })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<void> {
    await this.userManagementService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the user to delete' })
  @ApiResponse({ status: 202 })
  @ApiResponse({ status: 404, description: 'User not found' })
  async delete(@Param('id') id: string): Promise<void> {
    await this.userManagementService.delete(id);
  }

  @Put('plan/:id/upgrade')
  @Roles(Role.ADMIN, Role.USER)
  @ApiOperation({ summary: 'Upgrade a user plan by userID and planID' })
  @ApiParam({ name: 'id', description: 'The ID of the user' })
  @ApiParam({ name: 'planID', description: 'The ID of the plan' })
  @ApiResponse({ status: 202 })
  @ApiResponse({ status: 404, description: 'User not found' })
  async upgradePlan(
    @Param('id') id: string,
    @Param('planId') planId: string,
  ): Promise<void> {
    await this.userManagementService.upgradePlan(id, planId);
  }
}
