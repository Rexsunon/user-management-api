import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiKeyService } from 'src/feature/user-management/services';

@Injectable()
export class ApiKeyAuthGuard {
  constructor(
    private readonly apiKeyService: ApiKeyService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'] as string;

    if (!apiKey) {
      throw new UnauthorizedException('API Key is missing');
    }

    const isValid = await this.apiKeyService.validateApiKey(apiKey);
    if (!isValid) {
      throw new UnauthorizedException('Invalid API Key');
    }

    // TODO Get user by API key and pass to req['user']

    return true;
  }
}
