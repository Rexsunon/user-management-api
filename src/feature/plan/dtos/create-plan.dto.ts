import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePlanDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Name of plan',
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Plan description',
  })
  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @ApiPropertyOptional({
    type: Number,
    required: true,
    default: 0,
    description: 'Price of plan',
  })
  @IsInt()
  @IsOptional()
  readonly price: number;

  @ApiPropertyOptional({
    type: Number,
    required: true,
    default: 0,
    description: 'Duration of plan in months',
  })
  @IsInt()
  @IsOptional()
  readonly durationInMonths: number;

  @ApiPropertyOptional({
    type: Boolean,
    default: false,
    description: 'OTP verification code',
  })
  @IsBoolean()
  @IsOptional()
  readonly unlimited: boolean;

  @ApiPropertyOptional({
    type: Number,
    default: 0,
    description: 'Number of API calls per month',
  })
  @IsInt()
  @IsOptional()
  readonly monthlyApiCallLimit: number;
}
