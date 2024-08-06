import { Connection } from 'mongoose';
import { PlanSchema } from 'src/feature/plan/entities';

export const seedPlans = async (connection: Connection) => {
  const PlanModel = connection.model('Plan', PlanSchema);

  const existingPlans = await PlanModel.countDocuments();

  if (existingPlans === 0) {
    console.log('No plans found. Creating default Free Plan...');

    const freePlan = new PlanModel({
      name: 'Free Plan',
      description: 'Basic plan with limited features',
      tag: 'free_plan',
      price: 0,
      unlimited: false,
      monthlyApiCallLimit: 250,
    });

    await freePlan.save();

    console.log('Free Plan created successfully.');
  } else {
    console.log('Plans already exist. Skipping seed.');
  }
};
