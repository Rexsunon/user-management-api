import { Pagination } from 'src/shared';
import { Subscription } from '../entities';

export abstract class ISubscriptionService {
  abstract create(userId: string, planId: string): Promise<void>;
  abstract findSubscriptionByUserId(userId: string): Promise<Subscription>;
  abstract findAll(
    page: number,
    limit: number,
  ): Promise<Pagination<Subscription[]>>;
  abstract updateSubscription(userId: string, planId: string): Promise<void>;
}
