/**
 * @amalyatri/config
 *
 * Cross-environment configuration constants. Real config (secrets, DB URLs,
 * OAuth) lives in `.env` files and is loaded by `@nestjs/config` in the API
 * and by `next.config.js` in Web. This package only carries values that
 * must match across both runtimes.
 */

export const ROLES = {
  YATRI: 'YATRI',
  DOCTOR: 'DOCTOR',
  THERAPIST: 'THERAPIST',
  WELLNESS_GUIDE: 'WELLNESS_GUIDE',
  ADMIN: 'ADMIN',
} as const;

export const THROTTLE = {
  ttlSec: 60,
  limit: 120,
} as const;

export const JWT = {
  accessExpiresInSec: 60 * 15, // 15 minutes
  refreshExpiresInSec: 60 * 60 * 24 * 30, // 30 days
} as const;
