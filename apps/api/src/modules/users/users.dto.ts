import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() @MaxLength(80) firstName?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() @MaxLength(80) lastName?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() @MaxLength(80) displayName?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() @MaxLength(2) preferredLanguage?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() @MaxLength(80) city?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() @MaxLength(80) country?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() @MaxLength(1000) bio?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() avatarUrl?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() timezone?: string;
}

export class UpsertGoalsDto {
  @ApiProperty({ type: () => [WellnessGoalDto] })
  @IsArray()
  goals!: WellnessGoalDto[];
}

export class WellnessGoalDto {
  @ApiProperty() @IsString() @MaxLength(120) title!: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() category?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() metric?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsInt() @Min(0) targetValue?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsInt() @Min(0) currentValue?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() unit?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsDateString() dueDate?: string;
}
