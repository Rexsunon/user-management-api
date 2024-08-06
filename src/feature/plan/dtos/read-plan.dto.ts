import { ApiProperty } from '@nestjs/swagger';

export class ReadPlanDto {
  @ApiProperty({
    type: String,
    description: 'Plan id',
  })
  readonly id: string;

  @ApiProperty({
    type: String,
    description: 'Name of plan',
  })
  readonly name: string;

  @ApiProperty({
    type: String,
    description: 'Plan description',
  })
  readonly description: string;

  @ApiProperty({
    type: String,
    description: 'Plan tag',
  })
  readonly tag: string;

  @ApiProperty({
    type: Number,
    description: 'Price of plan',
  })
  readonly price: number;

  @ApiProperty({
    type: Number,
    description: 'Duration of plan in months',
  })
  readonly durationInMonths: number;

  @ApiProperty({
    type: Boolean,
    description: 'OTP verification code',
  })
  readonly unlimited: boolean;

  @ApiProperty({
    type: Number,
    description: 'Number of API calls per month',
  })
  readonly monthlyApiCallLimit: number;
}
