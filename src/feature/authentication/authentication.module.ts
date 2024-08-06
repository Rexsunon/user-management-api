import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from 'src/core/strategies/jwt.strategy';
import { NotificationModule } from '../notification/notification.module';
import { UserManagementModule } from '../user-management/user-management.module';
import { AuthenticationController } from './controllers/authentication.controller';
import { IAuthenticationService } from './interfaces/authentication.interface';
import { AuthenticationService } from './services/authentication.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user-management/entities';

@Module({
  imports: [
    ConfigModule.forRoot(),
    // todo import mongoose user model
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UserManagementModule,
    NotificationModule,
  ],
  providers: [
    { provide: IAuthenticationService, useClass: AuthenticationService },
    JwtStrategy,
  ],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
