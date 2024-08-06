import { Connection } from 'mongoose';
import { UserSchema } from 'src/feature/user-management/entities';
import { Role } from 'src/shared';

export const seedAdmin = async (connection: Connection) => {
  const UserModel = connection.model('User', UserSchema);

  const existingAdmins = await UserModel.countDocuments();

  if (existingAdmins === 0) {
    console.log('No admin user found. Creating default Admin User...');

    const adminUser = new UserModel({
      firstname: 'Admin',
      lastname: 'User',
      roles: [Role.ADMIN],
      email: process.env.ADMIN_EMAIL,
      verified: true,
      password: process.env.ADMIN_PASSWORD,
    });

    await adminUser.save();

    console.log('Admin user created successfully.');
  } else {
    console.log('Admin user already exist. Skipping seed.');
  }
};
