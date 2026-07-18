# Amal Yatri — Supabase Migration

> Migration from local Docker PostgreSQL to managed Supabase PostgreSQL.

## Supabase Project

- **URL**: https://amcxoqksdvnmmdycbgyc.supabase.co
- **Region**: US East (default)
- **Database**: PostgreSQL on port 5432

## Connection

The DATABASE_URL is set in `apps/api/.env`:

```
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.amcxoqksdvnmmdycbgyc.supabase.co:5432/postgres?schema=public
```

## Storage Buckets

| Bucket   | Public | Size Limit | Purpose                          |
|----------|--------|------------|----------------------------------|
| `uploads` | ✅     | 10 MB      | Community images, messages, docs |
| `avatars` | ✅     | 2 MB       | User profile pictures            |

## Local ↔ Supabase Workflow

```bash
# Generate Prisma client (reads DATABASE_URL from env)
npm run db:generate

# Run new migrations against Supabase
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.amcxoqksdvnmmdycbgyc.supabase.co:5432/postgres?schema=public" \
  npx prisma migrate deploy --schema=packages/prisma/prisma/schema.prisma

# Seed data on Supabase
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.amcxoqksdvnmmdycbgyc.supabase.co:5432/postgres?schema=public" \
  npx ts-node --transpile-only packages/prisma/prisma/seed.ts

# Create new migration (local dev)
npm run db:migrate      # runs against whatever DATABASE_URL is set
```

## Database Management

- **pgAdmin**: Use Supabase Dashboard → SQL Editor instead of local pgAdmin
- **Prisma Studio**: `npx prisma studio --schema=packages/prisma/prisma/schema.prisma`
- **Supabase Dashboard**: https://supabase.com/dashboard/project/amcxoqksdvnmmdycbgyc

## Schema

30+ models across 12 domains. See `packages/prisma/prisma/schema.prisma` for full schema.
Initial migration: `packages/prisma/prisma/migrations/20260718155933_init/`

## Seeded Credentials

| Role      | Email                       | Password       |
|-----------|-----------------------------|----------------|
| Admin     | admin@amalyatri.com         | amalwell2026   |
| Doctor    | devi@amaltamara.com         | amalwell2026   |
| Doctor    | arjun@amaltamara.com        | amalwell2026   |
| Yatri     | aarti@example.com           | amalwell2026   |
| Yatri     | ravi@example.com            | amalwell2026   |
| Yatri     | lena@example.com            | amalwell2026   |
