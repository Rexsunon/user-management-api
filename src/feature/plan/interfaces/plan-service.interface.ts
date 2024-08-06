import { Pagination } from 'src/shared';
import { CreatePlanDto, ReadPlanDto, UpdatePlanDto } from '../dtos';

export abstract class IPlanService {
  abstract create(createPlanDto: CreatePlanDto): Promise<void>;
  abstract findOne(id: string): Promise<ReadPlanDto>;
  abstract findOneWithTag(tag: string): Promise<ReadPlanDto>;
  abstract findAll(
    page: number,
    limit: number,
  ): Promise<Pagination<ReadPlanDto[]>>;
  abstract update(id: string, updatePlanDto: UpdatePlanDto): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
