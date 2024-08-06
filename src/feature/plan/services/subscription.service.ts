import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pagination } from 'src/shared';
import { Subscription } from '../entities';
import { IPlanService, ISubscriptionService } from '../interfaces';

@Injectable()
export class SubscriptionService implements ISubscriptionService {
  /**
   * Creates an instance of SubscriptionService.
   *
   * @param subscriptionModel - The Mongoose model for the Subscription entity.
   * @param planService - Service for handling plan-related operations.
   */
  constructor(
    @InjectModel(Subscription.name)
    private readonly subscriptionModel: Model<Subscription>,
    private readonly planService: IPlanService,
  ) {}

  /**
   * Creates a new subscription for a user with the specified plan.
   *
   * @param userId - The ID of the user subscribing to the plan.
   * @param planId - The ID of the plan being subscribed to.
   * @returns A promise that resolves when the subscription has been successfully created.
   */
  async create(userId: string, planId: string): Promise<void> {
    const startDate = new Date();
    let endDate: Date | null;

    const plan = await this.planService.findOne(planId);

    if (plan.price > 0) {
      endDate = new Date();
      endDate.setMonth(endDate.getMonth() + plan.durationInMonths || 1); // Set end date to one month from start date
    } else {
      endDate = null;
    }

    const subscription = new this.subscriptionModel({
      userId,
      planId,
      startDate,
      endDate,
      status: 'active',
    });

    await subscription.save();
  }

  /**
   * Finds an active subscription by user ID.
   *
   * @param userId - The ID of the user whose subscription is to be retrieved.
   * @returns A promise that resolves to the found Subscription document.
   * @throws NotFoundException if no active subscription is found for the provided user ID.
   */
  async findSubscriptionByUserId(userId: string): Promise<Subscription> {
    const subscription = await this.subscriptionModel
      .findOne({ userId, status: 'active' })
      .exec();

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    return subscription;
  }

  /**
   * Retrieves a paginated list of all subscriptions.
   *
   * @param page - The page number for pagination.
   * @param limit - The number of subscriptions per page.
   * @returns A promise that resolves to a Pagination object containing the subscriptions.
   */
  async findAll(
    page: number,
    limit: number,
  ): Promise<Pagination<Subscription[]>> {
    const skip = (page - 1) * limit;
    const [subscriptions, total] = await Promise.all([
      this.subscriptionModel.find().skip(skip).limit(limit).exec(),
      this.subscriptionModel.countDocuments().exec(),
    ]);

    return {
      page,
      pageSize: limit,
      totalPage: Math.ceil(total / limit), // Corrected calculation of total pages
      data: subscriptions,
    };
  }

  /**
   * Updates an existing subscription for a user with a new plan.
   *
   * @param userId - The ID of the user whose subscription is to be updated.
   * @param planId - The ID of the new plan to subscribe to.
   * @returns A promise that resolves when the subscription has been successfully updated.
   * @throws NotFoundException if no subscription is found for the user.
   */
  async updateSubscription(userId: string, planId: string): Promise<void> {
    const subscription = await this.findSubscriptionByUserId(userId);
    const plan = await this.planService.findOne(planId);

    subscription.planId = plan.id;
    subscription.startDate = new Date();

    if (plan.price > 0) {
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1); // Set end date to one month from start date

      subscription.endDate = endDate;
    } else {
      subscription.endDate = null;
    }

    subscription.status = 'active';
    await subscription.save();
  }
}
