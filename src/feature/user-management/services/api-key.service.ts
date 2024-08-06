import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as crypto from 'crypto';
import { Model } from 'mongoose';
import { ApiKey } from '../entities';
import { IApiKeyService } from '../interfaces';

@Injectable()
export class ApiKeyService implements IApiKeyService {
  /**
   * Creates an instance of ApiKeyService.
   *
   * @param apiKeyModel - The Mongoose model for the ApiKey entity.
   */
  constructor(
    @InjectModel(ApiKey.name) private readonly apiKeyModel: Model<ApiKey>,
  ) {}

  /**
   * Creates a new API key for the specified user.
   *
   * @param userId - The ID of the user for whom the API key is being created.
   * @returns A promise that resolves to the created ApiKey document.
   */
  async create(userId: string): Promise<ApiKey> {
    // Create a user and generate an API key
    const apiKeyValue = crypto.randomBytes(32).toString('hex');

    const apiKey = await this.apiKeyModel.create({
      user: userId,
      key: apiKeyValue,
    });

    return apiKey;
  }

  /**
   * Validates if the provided API key exists in the database.
   *
   * @param apiKey - The API key to validate.
   * @returns A promise that resolves to true if the API key is found, otherwise false.
   */
  async validateApiKey(apiKey: string): Promise<boolean> {
    const apiKeyRecord = await this.apiKeyModel.findOne({ key: apiKey }).exec();
    return !!apiKeyRecord;
  }
}
