import { ApiKey } from '../entities';

export abstract class IApiKeyService {
  abstract create(userId: string): Promise<ApiKey>;
  abstract validateApiKey(apiKey: string): Promise<boolean>;
}
