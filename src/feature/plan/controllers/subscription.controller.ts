import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/core/decorators';
import { JwtAuthGuard, RolesGuard } from 'src/core/guards';
import { Pagination, Role } from 'src/shared';
import { ReadPlanDto } from '../dtos';
import { Subscription } from '../entities';
import { ISubscriptionService } from '../interfaces';

@ApiTags('subscription')
@ApiBearerAuth()
@Controller('subscription')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubscriptionController {
  constructor(private readonly subscriptionService: ISubscriptionService) {}

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all subscriptions with pagination' })
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
    description: 'Number of subscriptions per page',
  })
  @ApiResponse({
    status: 200,
    description: 'List of subscriptions with pagination.',
    type: Pagination<Subscription[]>,
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Pagination<Subscription[]>> {
    return this.subscriptionService.findAll(page, limit);
  }

  @Get('user/:userId')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get a subscription by userID' })
  @ApiParam({
    name: 'userId',
    description: 'The ID of the subscription to retrieve',
  })
  @ApiResponse({
    status: 200,
    description: 'The subscription with the specified userID.',
    type: ReadPlanDto,
  })
  @ApiResponse({ status: 404, description: 'Subscription not found' })
  async findSubscriptionByUserId(
    @Param('userId') userId: string,
  ): Promise<Subscription> {
    return this.subscriptionService.findSubscriptionByUserId(userId);
  }
}
