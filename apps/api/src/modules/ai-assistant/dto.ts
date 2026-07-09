import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateConversationDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() @MaxLength(120) title?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() @MaxLength(60) topic?: string;
}

export class SendMessageDto {
  @ApiProperty({ example: 'A gentle evening yoga routine, please.' })
  @IsString() @MaxLength(2000)
  message!: string;
}
