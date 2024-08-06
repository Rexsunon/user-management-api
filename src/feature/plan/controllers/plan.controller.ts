import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
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
import { Roles } from 'src/core/decorators';
import { JwtAuthGuard, RolesGuard } from 'src/core/guards';
import { Pagination, Role } from 'src/shared';
import { CreatePlanDto, ReadPlanDto, UpdatePlanDto } from '../dtos';
import { IPlanService } from '../interfaces';

@ApiTags('plans')
@ApiBearerAuth()
@Controller('plans')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PlanController {
  constructor(private readonly planService: IPlanService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new plan' })
  @ApiResponse({
    status: 201,
    description: 'The plan has been created successfully.',
  })
  async create(@Body() createPlanDto: CreatePlanDto): Promise<void> {
    await this.planService.create(createPlanDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all plans with pagination' })
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
    description: 'Number of plans per page',
  })
  @ApiResponse({
    status: 200,
    description: 'List of plans with pagination.',
    type: Pagination<ReadPlanDto[]>,
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Pagination<ReadPlanDto[]>> {
    return this.planService.findAll(page, limit);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.USER)
  @ApiOperation({ summary: 'Get a plan by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the plan to retrieve' })
  @ApiResponse({
    status: 200,
    description: 'The plan with the specified ID.',
    type: ReadPlanDto,
  })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  async findOne(@Param('id') id: string): Promise<ReadPlanDto> {
    return this.planService.findOne(id);
  }

  @Get('tag/:tag')
  @Roles(Role.ADMIN, Role.USER)
  @ApiOperation({ summary: 'Get a plan by TAG' })
  @ApiParam({ name: 'tag', description: 'The TAG of the plan to retrieve' })
  @ApiResponse({
    status: 200,
    description: 'The plan with the specified TAG.',
    type: ReadPlanDto,
  })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  async findOneWitTag(@Param('tag') tag: string): Promise<ReadPlanDto> {
    return this.planService.findOneWithTag(tag);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update a plan by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the plan to update' })
  @ApiResponse({ status: 202 })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdatePlanDto,
  ): Promise<void> {
    await this.planService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a plan by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the plan to delete' })
  @ApiResponse({ status: 202 })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  async delete(@Param('id') id: string): Promise<void> {
    await this.planService.delete(id);
  }
}
