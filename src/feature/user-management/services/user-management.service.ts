import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ITokenService } from 'src/feature/notification/interfaces';
import {
  IPlanService,
  ISubscriptionService,
} from 'src/feature/plan/interfaces';
import { Pagination, UserAlreadyExistsException } from 'src/shared';
import { toReadUserDto } from 'src/shared/util';
import { CreateUserDto, ReadUserDto, UpdateUserDto } from '../dtos';
import { User, UserDocument } from '../entities';
import { IApiKeyService, IUserManagementService } from '../interfaces';

@Injectable()
export class UserManagementService implements IUserManagementService {
  /**
   * Creates an instance of UserManagementService.
   *
   * @param userModel - The Mongoose model for the User entity.
   * @param apiKeyService - Service for handling API key operations.
   * @param tokenService - Service for handling token operations.
   * @param planService - Service for handling plan operations.
   * @param subscriptionService - Service for handling subscription operations.
   */
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly apiKeyService: IApiKeyService,
    private readonly tokenService: ITokenService,
    private readonly planService: IPlanService,
    private readonly subscriptionService: ISubscriptionService,
  ) {}

  /**
   * Creates a new user and assigns a free plan by default.
   *
   * @param createUserDto - The data transfer object containing user details for creation.
   * @returns A promise that resolves when the user has been successfully created.
   * @throws UserAlreadyExistsException if a user with the provided email already exists.
   */
  async create(createUserDto: CreateUserDto): Promise<void> {
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (existingUser) {
      throw new UserAlreadyExistsException(createUserDto.email);
    }

    // TODO do not create a plan for an admin user

    // Get free plan
    const freePlan = await this.planService.findOneWithTag('free_plan');

    // Verify user token
    await this.tokenService.verifyToken(createUserDto.otp);

    const createdUser = await this.userModel.create(createUserDto);
    const createApiKey = await this.apiKeyService.create(createdUser.id);

    createdUser.apiKey = createApiKey;
    createdUser.verified = true;

    await createdUser.save();

    // Assign the free plan by default
    await this.subscriptionService.create(createdUser.id, freePlan.id);
  }

  /**
   * Retrieves a paginated list of all users.
   *
   * @param page - The page number for pagination (default is 1).
   * @param limit - The number of users per page (default is 10).
   * @returns A promise that resolves to a Pagination object containing user data.
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<Pagination<ReadUserDto[]>> {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.userModel.find().skip(skip).limit(limit).exec(),
      this.userModel.countDocuments().exec(),
    ]);

    return {
      page,
      pageSize: limit,
      totalPage: Math.ceil(total / limit), // Calculate total pages correctly
      data: users.map((user) => toReadUserDto(user)),
    };
  }

  /**
   * Finds a user by their ID.
   *
   * @param id - The ID of the user to retrieve.
   * @returns A promise that resolves to the ReadUserDto of the found user.
   * @throws NotFoundException if no user with the provided ID is found.
   */
  async findOne(id: string): Promise<ReadUserDto> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return toReadUserDto(user);
  }

  /**
   * Updates a user with the provided details.
   *
   * @param id - The ID of the user to update.
   * @param updateUserDto - The data transfer object containing the updated user details.
   * @returns A promise that resolves when the user has been successfully updated.
   * @throws NotFoundException if no user with the provided ID is found.
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<void> {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  /**
   * Deletes a user by their ID.
   *
   * @param id - The ID of the user to delete.
   * @returns A promise that resolves when the user has been successfully deleted.
   * @throws NotFoundException if no user with the provided ID is found.
   */
  async delete(id: string): Promise<void> {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.userModel.deleteOne({ id });
  }

  /**
   * Validates the provided password against the user’s stored password.
   *
   * @param id - The ID of the user to validate the password for.
   * @param password - The password to validate.
   * @returns A promise that resolves to true if the password is correct, otherwise false.
   * @throws NotFoundException if no user with the provided ID is found.
   */
  async validatePassword(id: string, password: string): Promise<boolean> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return await user.comparePassword(password);
  }

  /**
   * Upgrades the plan for a specified user.
   *
   * @param userId - The ID of the user whose plan is to be upgraded.
   * @param planId - The ID of the new plan to assign to the user.
   * @returns A promise that resolves when the user's subscription has been successfully updated.
   * @throws NotFoundException if no user with the provided ID or no plan with the provided ID is found.
   */
  async upgradePlan(userId: string, planId: string): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const plan = await this.planService.findOne(planId);
    await this.subscriptionService.updateSubscription(userId, plan.id);
  }
}
