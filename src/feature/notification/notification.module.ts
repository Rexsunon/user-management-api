import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenController } from './controllers/token.controller';
import { Token, TokenSchema } from './entities/token.entity';
import { ITokenService } from './interfaces';
import { TokenService } from './services/token.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
  ],
  providers: [{ provide: ITokenService, useClass: TokenService }],
  controllers: [TokenController],
  exports: [ITokenService],
})
export class NotificationModule {}
