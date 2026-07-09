import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { RetreatType, RetreatStatus } from '@prisma/client';

export class CreateRetreatDto {
  @ApiProperty({ example: '14-day Panchakarma — January 2026' })
  @IsString() @MaxLength(200) title!: string;

  @ApiProperty({ enum: RetreatType })
  @IsEnum(RetreatType) type!: RetreatType;

  @ApiProperty({ required: false, enum: RetreatStatus })
  @IsOptional() @IsEnum(RetreatStatus) status?: RetreatStatus;

  @ApiProperty() @IsDateString() startDate!: string;
  @ApiProperty() @IsDateString() endDate!: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() locationCity?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() notes?: string;
}

export class CreateAssessmentDto {
  @ApiProperty() @IsString() kind!: string;
  @ApiProperty({ description: 'Free-form metrics blob' })
  metrics!: Record<string, unknown>;
  @ApiProperty({ required: false }) @IsOptional() @IsString() summary?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() retreatId?: string;
}

export class CreateGoalDto {
  @ApiProperty() @IsString() @MaxLength(120) title!: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() category?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() metric?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsInt() @Min(0) targetValue?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsInt() @Min(0) currentValue?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() unit?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsDateString() dueDate?: string;
}

export class UpdateGoalDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() title?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsInt() @Min(0) currentValue?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() status?: string;
}

export class CreateTimelineEventDto {
  @ApiProperty() @IsString() type!: string;
  @ApiProperty() @IsString() @MaxLength(200) title!: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() description?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsDateString() occurredAt?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() metricName?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsInt() @Min(0) metricValue?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() metricUnit?: string;
  @ApiProperty({ required: false, type: [String] }) @IsOptional() @IsArray() tags?: string[];
}
