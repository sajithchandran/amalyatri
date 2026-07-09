# Amal Yatri — Docker Stack

Full local dev stack: PostgreSQL + pgAdmin + NestJS API + Next.js Web.

## One-time setup

```bash
cp .env.example .env             # edit passwords / secrets if you like
docker compose pull              # fetch postgres + pgadmin images
docker compose build             # build the api + web images
```

## First run (builds + seeds DB)

```bash
# 1. Start the DB + pgadmin + api + web
docker compose up -d

# 2. Initialize the schema and seed demo data (one-shot, then exits)
docker compose --profile init up prisma-init
```

`prisma-init` pushes the Prisma schema and runs the seed script. Check logs:

```bash
docker compose logs prisma-init
```

You should see `✅ Seed complete.`

## Subsequent runs

```bash
docker compose up -d
# or to rebuild after changing code:
docker compose up -d --build
```

## Services

| Service      | URL                                | Notes                                    |
|--------------|-------------------------------------|------------------------------------------|
| Web          | http://localhost:3000               | Next.js landing/login/dashboard/etc     |
| API          | http://localhost:3001               | NestJS REST API                          |
| Swagger docs | http://localhost:3001/api/docs      | OpenAPI explorer                         |
| pgAdmin      | http://localhost:5050               | Postgres admin UI — login from `.env`   |
| Postgres     | `localhost:5432`                    | Direct DB access                         |

### Connect pgAdmin → Postgres

1. Open http://localhost:5050
2. Login with `PGADMIN_DEFAULT_EMAIL` / `PGADMIN_DEFAULT_PASSWORD` from `.env`
3. Right-click "Servers" → "Register" → "Server"
4. **General** tab: Name = `Amal Yatri Local`
5. **Connection** tab:
   - Host = `postgres` (the docker service name, NOT `localhost`)
   - Port = `5432`
   - Username = `amalyatri`
   - Password = from `.env`
6. Save

### Seeded login credentials

After running `prisma-init`, these accounts work:

| Role     | Email                       | Password        |
|----------|------------------------------|-----------------|
| Yatri    | `aarti@example.com`         | `amalwell2026` |
| Yatri    | `ravi@example.com`          | `amalwell2026` |
| Yatri    | `priya@example.com`         | `amalwell2026` |
| Doctor   | `devi@amaltamara.com`       | `***` |
| Doctor   | `arjun@amaltamara.com`      | `***` |
| Guide    | `meera@amaltamara.com`      | `***` |
| Guide    | `kiran@amaltamara.com`      | `***` |
| Admin    | `admin@amalyatri.local`     | `admin123`    |

## Useful commands

```bash
# Tail logs
docker compose logs -f api web

# Restart a single service after code change
docker compose restart api

# Open a shell inside the API container
docker compose exec api sh

# Open a psql session against the DB
docker compose exec postgres psql -U amalyatri -d amalyatri

# Wipe everything (DELETES the DB volume)
docker compose down -v
```

## Path-prefix note

API URLs inside Docker resolve to `/api/v1/health`, `/api/v1/auth/login`, etc. — clean, single-version. The host-side `/api/v1/v1/*` doubling bug from earlier was caused by `.env` having `API_PREFIX=api/v1`. The Docker `.env.example` sets `API_PREFIX=api` so versioning (configured in `main.ts` as `VersioningType.URI` with `defaultVersion: '1'`) adds the single trailing `/v1`.

## Troubleshooting

**API container exits with "can't resolve PrismaService"** — depends_on may have started before Postgres was actually ready. The compose uses `condition: service_healthy` on Postgres which fixes this. If it still fails, restart: `docker compose restart api`.

**Seed script fails with permission denied on /tmp** — Prisma writes to `/tmp`; in containers that's fine. If you see I/O errors, increase the seed container's memory.

**Web shows "Cannot connect to API"** — check `NEXT_PUBLIC_API_URL` in `.env`. It must be reachable from your browser (typically `http://localhost:3001/api/v1`). Inside the API container, use `http://api:3001/api/v1` (composed network DNS).
