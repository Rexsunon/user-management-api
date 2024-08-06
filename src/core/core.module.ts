import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongoConfig } from './config/database.config';
import { UserManagementModule } from 'src/feature/user-management/user-management.module';

let env = '.env';
if (process.env.NODE_ENV == 'development') {
  env = '.env.development.local';
}

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: env,
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) =>
        getMongoConfig(configService),
      inject: [ConfigService],
    }),
    UserManagementModule,
  ],
})
export class CoreModule {}
