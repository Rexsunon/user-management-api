import { NestFactory } from '@nestjs/core';
import { connect, Connection } from 'mongoose';
import { AppModule } from 'src/app.module';
import { seedAdmin, seedPlans } from 'src/core/seed/seed-data';

export async function seed() {
  try {
    const app = await NestFactory.create(AppModule);
    const connection: Connection = (await connect(process.env.MONGODB_URI))
      .connection;
    console.log('MongoDB connected successfully');

    await seedPlans(connection);
    await seedAdmin(connection);

    await app.close();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}
