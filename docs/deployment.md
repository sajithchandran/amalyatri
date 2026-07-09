# Amal Yatri — Deployment Guide

> Production deployment for v0.1. Each phase can be done independently.

## 0. Prerequisites

- Node.js ≥ 20.10
- npm ≥ 10
- Docker + docker compose (for local Postgres)
- (Production) A managed Postgres — Neon, Supabase, RDS, Aiven — TLS-enabled
- (Production) An SMTP provider — SES, Postmark, Resend
- (Production) An object store — AWS S3, Azure Blob, MinIO

## 1. First-time setup

```bash
git clone git@github.com:sajithchandran/amalyatri.git
cd amalyatri
npm install                  # installs across workspaces
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env   # when you create one
```

Edit `.env` values — never commit secrets.

## 2. Local development

```bash
# Postgres + adminer (optional) via compose
npm run docker:up

# Prisma
npm run db:generate
npm run db:migrate
npm run db:seed

# Everything in parallel
npm run dev
```

- Web: http://localhost:3000
- API: http://localhost:3001
- API docs: http://localhost:3001/api/docs

Demo password for all seeded users: `amalwell2026`.

## 3. Production build

```bash
# Workspace artifacts
npm run build

# Outputs:
#   apps/api/dist/         NestJS bundle
#   apps/web/.next/        Next.js output
#   packages/prisma/dist/  Prisma client wrapper
```

## 4. Run as a service

### API
```bash
node apps/api/dist/main.js
```

Environment variables (minimum):
```
NODE_ENV=production
PORT=3001
API_PREFIX=api/v1
DATABASE_URL=postgresql://...
JWT_ACCESS_SECRET=<32+ random bytes>
JWT_REFRESH_TTL_DAYS=30
CORS_ORIGINS=https://amalyatri.com,https://www.amalyatri.com
THROTTLE_TTL=60
THROTTLE_LIMIT=120
STORAGE_PROVIDER=s3
S3_BUCKET=...
S3_REGION=ap-south-1
S3_ACCESS_KEY=...
S3_SECRET_KEY=...
AI_PROVIDER=openai              # stub|openai|anthropic|local
AI_API_KEY=...
```

Run behind a reverse proxy (nginx, Caddy, Cloudflare). Terminate TLS at the proxy; the app itself serves HTTP.

### Web
```bash
PORT=3000 node apps/web/.next/standalone/server.js
```

(When using Next's standalone output — `output: 'standalone'` in `next.config.js`; configure when building for non-Vercel.)

## 5. Recommended hosting

- **Web (Next.js):** Vercel (zero-config) or a self-hosted Node container behind Caddy/nginx.
- **API (NestJS):** A small VM or fly.io / Render container. Memory is cheap; the API is mostly idle.
- **Database:** Neon / Supabase / RDS with connection pooler. Set `?pgbouncer=true&connection_limit=1` if pooling.
- **Object storage:** AWS S3 (Mumbai region) for low latency to India.
- **Email:** SES or Postmark.
- **AI:** OpenAI gpt-4o-mini for cost, Claude for nuance. Keep both as fallbacks.

## 6. CI/CD (suggested)

- GitHub Actions on PR: `npm ci`, `npm run lint`, `npm run build`, `prisma format check`.
- On `main` push: deploy preview to a staging slot.
- Promote manually to production.

## 7. Observability

v0.2 introduces:
- `nestjs-pino` structured logs → Cloudwatch / Better Stack / Loki
- Sentry for browser errors
- Prometheus `/metrics` on the API
- OpenTelemetry traces → Tempo / Honeycomb

## 8. Backups

- Postgres: daily logical (`pg_dump`), 30-day retention.
- Object storage: versioning enabled, lifecycle policy moves old versions to S3 Glacier after 90 days.

## 9. Costs (indicative, 1000 MAU)

- Vercel Pro: ~$20
- Fly.io shared-cpu: ~$10
- Neon launch: ~$19
- S3: ~$2
- OpenAI: ~$50–150 (depends on chat volume)
- Postmark: $15 (10k emails)
- **~ $115–220 / month**

## 10. Disaster recovery

- Restore Postgres to a point-in-time within 7 days (Neon / RDS default).
- All media is in S3 with versioning; loss is recoverable.
- JWT secrets are rotated through a controlled redeploy.
