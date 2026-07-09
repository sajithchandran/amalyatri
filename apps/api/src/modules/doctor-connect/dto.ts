import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';

export class SendMessageDto {
  @ApiProperty() @IsString() recipientId!: string;
  @ApiProperty({ required: false, enum: ['TEXT', 'VOICE', 'IMAGE', 'DOCUMENT'] })
  @IsOptional() @IsEnum(['TEXT', 'VOICE', 'IMAGE', 'DOCUMENT'] as any)
  kind?: 'TEXT' | 'VOICE' | 'IMAGE' | 'DOCUMENT';
  @ApiProperty({ required: false }) @IsOptional() @IsString() @MaxLength(8000) body?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsUrl() mediaUrl?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsInt() @Min(0) durationSec?: number;
}

export class RequestConsultationDto {
  @ApiProperty() @IsString() doctorProfileId!: string;
  @ApiProperty({ required: false, enum: ['IN_PERSON', 'VIDEO', 'PHONE', 'CHAT'] })
  @IsOptional() @IsEnum(['IN_PERSON', 'VIDEO', 'PHONE', 'CHAT'] as any)
  mode?: 'IN_PERSON' | 'VIDEO' | 'PHONE' | 'CHAT';
  @ApiProperty({ required: false }) @IsOptional() @IsDateString() scheduledFor?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() @MaxLength(2000) patientNote?: string;
}
