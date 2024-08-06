import { ApiProperty } from '@nestjs/swagger';

export class Pagination<T> {
  @ApiProperty({
    description: 'The current page number',
    example: 1,
    type: Number,
  })
  readonly page: number;

  @ApiProperty({
    description: 'The number of items per page',
    example: 10,
    type: Number,
  })
  readonly pageSize: number;

  @ApiProperty({
    description: 'The total number of pages',
    example: 5,
    type: Number,
  })
  readonly totalPage: number;

  @ApiProperty({
    description: 'The paginated data',
    type: 'array',
    items: {
      type: 'object',
      description:
        'Generic type T, represents the data structure being paginated',
    },
  })
  readonly data: T;
}
