import { Pagination } from 'src/shared';
import { Token } from '../entities/token.entity';

export abstract class ITokenService {
  abstract create(email: string, subject: string): Promise<string>;
  abstract findOne(token: string): Promise<Token>;
  abstract findAll(
    page: number,
    limit: number,
    email?: string,
  ): Promise<Pagination<Token[]>>;
  abstract verifyToken(token: string): Promise<boolean>;
}
