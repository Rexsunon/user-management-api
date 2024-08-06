import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlanController, SubscriptionController } from './controllers';
import { Plan, PlanSchema, Subscription, SubscriptionSchema } from './entities';
import { IPlanService, ISubscriptionService } from './interfaces';
import { PlanService, SubscriptionService } from './services';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Plan.name, schema: PlanSchema },
      { name: Subscription.name, schema: SubscriptionSchema },
    ]),
  ],
  providers: [
    { provide: IPlanService, useClass: PlanService },
    { provide: ISubscriptionService, useClass: SubscriptionService },
  ],
  controllers: [PlanController, SubscriptionController],
  exports: [IPlanService, ISubscriptionService],
})
export class PlanModule {}
