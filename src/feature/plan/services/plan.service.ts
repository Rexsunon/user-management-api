import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pagination } from 'src/shared';
import { CreatePlanDto, ReadPlanDto, UpdatePlanDto } from '../dtos';
import { Plan } from '../entities';
import { IPlanService } from '../interfaces';

@Injectable()
export class PlanService implements IPlanService {
  /**
   * Creates an instance of PlanService.
   *
   * @param planModel - The Mongoose model for the Plan entity.
   */
  constructor(
    @InjectModel(Plan.name) private readonly planModel: Model<Plan>,
  ) {}

  /**
   * Creates a new plan in the database.
   *
   * @param createPlanDto - Data transfer object containing details of the plan to be created.
   * @returns A promise that resolves when the plan has been successfully created.
   * @throws BadRequestException if a plan with the same name already exists.
   */
  async create(createPlanDto: CreatePlanDto): Promise<void> {
    const plan = await this.planModel.findOne({ name: createPlanDto.name });

    if (plan) {
      throw new BadRequestException(
        `Plan with name ${createPlanDto.name} already exist.`,
      );
    }
    await this.planModel.create(createPlanDto);
  }

  /**
   * Finds a plan by its ID.
   *
   * @param id - The ID of the plan to find.
   * @returns A promise that resolves to the found plan, mapped to ReadPlanDto.
   * @throws NotFoundException if no plan is found with the provided ID.
   */
  async findOne(id: string): Promise<ReadPlanDto> {
    const plan = await this.planModel.findById(id);

    if (!plan) {
      throw new NotFoundException(`Plan with ID ${id} not found.`);
    }

    return this.toReadPlanDto(plan);
  }

  /**
   * Finds a plan by its tag.
   *
   * @param tag - The tag of the plan to find.
   * @returns A promise that resolves to the found plan, mapped to ReadPlanDto.
   * @throws NotFoundException if no plan is found with the provided tag.
   */
  async findOneWithTag(tag: string): Promise<ReadPlanDto> {
    const plan = await this.planModel.findOne({ tag });

    if (!plan) {
      throw new NotFoundException(`Plan with TAG ${tag} not found.`);
    }

    return this.toReadPlanDto(plan);
  }

  /**
   * Retrieves a paginated list of plans.
   *
   * @param page - The page number for pagination.
   * @param limit - The number of plans per page.
   * @returns A promise that resolves to a Pagination object containing the plans.
   */
  async findAll(
    page: number,
    limit: number,
  ): Promise<Pagination<ReadPlanDto[]>> {
    const skip = (page - 1) * limit;
    const [plans, total] = await Promise.all([
      this.planModel.find().skip(skip).limit(limit).exec(),
      this.planModel.countDocuments().exec(),
    ]);

    return {
      page,
      pageSize: limit,
      totalPage: Math.ceil(total / limit), // Corrected calculation of total pages
      data: plans.map((plan) => this.toReadPlanDto(plan)),
    };
  }

  /**
   * Updates an existing plan by its ID.
   *
   * @param id - The ID of the plan to update.
   * @param updatePlanDto - Data transfer object containing updated details for the plan.
   * @returns A promise that resolves when the plan has been successfully updated.
   * @throws NotFoundException if no plan is found with the provided ID.
   */
  async update(id: string, updatePlanDto: UpdatePlanDto): Promise<void> {
    const plan = await this.planModel.findById(id);

    if (!plan) {
      throw new NotFoundException(`Plan with ID ${id} not found.`);
    }

    await this.planModel
      .findByIdAndUpdate(id, updatePlanDto, { new: true })
      .exec();
  }

  /**
   * Deletes a plan by its ID.
   *
   * @param id - The ID of the plan to delete.
   * @returns A promise that resolves when the plan has been successfully deleted.
   * @throws NotFoundException if no plan is found with the provided ID.
   */
  async delete(id: string): Promise<void> {
    const plan = await this.planModel.findById(id);

    if (!plan) {
      throw new NotFoundException(`Plan with ID ${id} not found.`);
    }

    await this.planModel.deleteOne({ id });
  }

  /**
   * Maps a Plan entity to a ReadPlanDto.
   *
   * @param plan - The Plan entity to map.
   * @returns The mapped ReadPlanDto.
   */
  private toReadPlanDto = (plan: Plan): ReadPlanDto => {
    return {
      id: plan.id,
      name: plan.name,
      description: plan.description,
      tag: plan.tag,
      monthlyApiCallLimit: plan.monthlyApiCallLimit,
      price: plan.price,
      durationInMonths: plan.durationInMonths,
      unlimited: plan.unlimited,
    };
  };
}
