import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export const ROLES = [
  'YATRI',
  'DOCTOR',
  'THERAPIST',
  'WELLNESS_GUIDE',
  'ADMIN',
] as const;

export class RegisterDto {
  @ApiProperty({ example: 'aarti@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'StrongPass!234', minLength: 8 })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;

  @ApiProperty({ example: 'Aarti' })
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  firstName!: string;

  @ApiProperty({ example: 'Sharma' })
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  lastName!: string;

  @ApiProperty({ enum: ROLES, example: 'YATRI' })
  @IsIn(ROLES as unknown as string[])
  role!: (typeof ROLES)[number];

  @ApiProperty({ required: false, example: 'Aarti' })
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiProperty({ required: false, example: '+919876543210' })
  @IsOptional()
  @Matches(/^\+?[1-9]\d{6,14}$/, { message: 'Phone must be E.164 format' })
  phone?: string;
}

export class LoginDto {
  @ApiProperty({ example: 'aarti@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'StrongPass!234' })
  @IsString()
  password!: string;
}

export class RefreshDto {
  @ApiProperty()
  @IsString()
  refreshToken!: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: 'aarti@example.com' })
  @IsEmail()
  email!: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  token!: string;

  @ApiProperty({ example: 'NewStrongPass!234', minLength: 8 })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  newPassword!: string;
}

export class AuthResponse {
  @ApiProperty() user!: {
    id: string;
    email: string;
    role: string;
    firstName?: string;
    lastName?: string;
  };
  @ApiProperty() accessToken!: string;
  @ApiProperty() refreshToken!: string;
  @ApiProperty() accessExpiresInSec!: number;
}
