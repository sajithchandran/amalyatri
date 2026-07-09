/**
 * @amalyatri/shared
 *
 * Cross-app utilities: formatters, constants, role enums, error shapes,
 * and small pure helpers that don't carry backend infrastructure.
 *
 * This package is intentionally framework-agnostic — safe to import from
 * both NestJS and Next.js without pulling in transitive deps.
 */

export const AMAL_TAMARA_BRAND = {
  name: 'Amal Tamara',
  location: 'Kovalam, Kerala',
  tagline: 'Where healing meets the sea',
  palette: {
    forest: '#1F3D2E',
    clay: '#C46A4A',
    sun: '#E5A04C',
    cream: '#F6F1E8',
  },
} as const;

export const API_VERSION = 'v0.1';
