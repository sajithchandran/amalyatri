/**
 * @amalyatri/types
 *
 * Shared TypeScript types reused by both API and Web. Re-exports the
 * backend Prisma enums (when resolvable) plus a few hand-curated DTO
 * shapes that are version-stable.
 */

export type UserRole =
  | 'YATRI'
  | 'DOCTOR'
  | 'THERAPIST'
  | 'WELLNESS_GUIDE'
  | 'ADMIN';

export type ConsultationStatus =
  | 'REQUESTED'
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
  path?: string;
  timestamp?: string;
}
