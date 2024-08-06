import { Pagination } from 'src/shared';
import { CreateUserDto, ReadUserDto, UpdateUserDto } from '../dtos';

export abstract class IUserManagementService {
  abstract create(createUserDto: CreateUserDto): Promise<void>;
  abstract findAll(
    page: number,
    limit: number,
  ): Promise<Pagination<ReadUserDto[]>>;
  abstract findOne(id: string): Promise<ReadUserDto>;
  abstract update(id: string, updateUserDto: UpdateUserDto): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract validatePassword(id: string, password: string): Promise<boolean>;
  abstract upgradePlan(userId: string, planId: string): Promise<void>;
}
