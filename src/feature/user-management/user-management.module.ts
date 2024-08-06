import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationModule } from '../notification/notification.module';
import { PlanModule } from '../plan/plan.module';
import { UserManagementController } from './controllers/user-management.controller';
import { ApiKey, ApiKeySchema, User, UserSchema } from './entities';
import { IApiKeyService, IUserManagementService } from './interfaces';
import { ApiKeyService, UserManagementService } from './services';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: ApiKey.name, schema: ApiKeySchema },
    ]),
    NotificationModule,
    PlanModule,
  ],
  providers: [
    { provide: IApiKeyService, useClass: ApiKeyService },
    { provide: IUserManagementService, useClass: UserManagementService },
  ],
  controllers: [UserManagementController],
  exports: [IApiKeyService, IUserManagementService],
})
export class UserManagementModule {}
