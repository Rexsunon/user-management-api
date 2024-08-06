import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as crypto from 'crypto';
import { Model } from 'mongoose';
import { Token, TokenDocument } from '../entities/token.entity';
import { ITokenService } from '../interfaces';
import { Pagination } from 'src/shared';

@Injectable()
export class TokenService implements ITokenService {
  /**
   * Creates an instance of TokenService.
   *
   * @param tokenModel - The Mongoose model for the Token entity.
   */
  constructor(
    @InjectModel(Token.name) private readonly tokenModel: Model<TokenDocument>,
  ) {}

  /**
   * Creates a new OTP (One-Time Password) token and saves it to the database.
   *
   * @param email - The email address associated with the OTP token.
   * @param subject - The subject or purpose of the OTP token (e.g., 'Forgot Password').
   * @returns A promise that resolves to the generated OTP value.
   */
  async create(email: string, subject: string): Promise<string> {
    const otpValue = crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // OTP valid for 10 minutes

    const otp = new this.tokenModel({
      token: otpValue,
      subject,
      email,
      expiresAt,
    });
    await otp.save();

    // TODO: implement sendGridService
    // const subject = 'Your OTP Code';
    // const text = `Your OTP code is: ${otpValue}`;
    // await this.sendGridService.sendEmail(email, subject, text);

    // TODO remove this log after email implementaion
    console.log(otp);

    return otpValue;
  }

  /**
   * Finds a token by its value.
   *
   * @param token - The OTP token value to search for.
   * @returns A promise that resolves to the found Token document.
   * @throws NotFoundException if no token is found with the provided value.
   */
  async findOne(token: string): Promise<Token> {
    const tokenRecord = await this.tokenModel.findOne({ token });

    if (!tokenRecord) {
      throw new NotFoundException('Token not found');
    }

    return tokenRecord;
  }

  /**
   * Retrieves a paginated list of tokens, optionally filtered by email.
   *
   * @param page - The page number for pagination.
   * @param limit - The number of tokens per page.
   * @param email - Optional email address to filter tokens by.
   * @returns A promise that resolves to a Pagination object containing the tokens.
   */
  async findAll(
    page: number,
    limit: number,
    email?: string,
  ): Promise<Pagination<Token[]>> {
    const query = email ? { email: { $regex: email, $options: 'i' } } : {};

    const skip = (page - 1) * limit;
    const [tokens, total] = await Promise.all([
      this.tokenModel.find(query).skip(skip).limit(limit).exec(),
      this.tokenModel.countDocuments().exec(),
    ]);

    return {
      page,
      pageSize: limit,
      totalPage: Math.ceil(total / limit), // Corrected calculation of total pages
      data: tokens,
    };
  }

  /**
   * Verifies a token's validity and deletes it if valid.
   *
   * @param token - The OTP token value to verify.
   * @returns A promise that resolves to true if the token is valid and was successfully verified.
   * @throws NotFoundException if the token is not found.
   * @throws BadRequestException if the token has expired.
   */
  async verifyToken(token: string): Promise<boolean> {
    const tokenRecord = await this.tokenModel.findOne({ token }).exec();

    if (!tokenRecord) {
      throw new NotFoundException('Token not found');
    }

    if (tokenRecord.verifyToken()) {
      throw new BadRequestException('Token has expired');
    }

    await this.tokenModel.deleteOne({ token });

    return true;
  }
}
