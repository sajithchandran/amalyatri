# Amal Yatri — Architecture

> How the pieces fit. This document evolves with the system; if you change
> something architectural, update it in the same commit.

## 1. Topology

```
            ┌─────────────────────────────────────────────────────────────┐
            │                       users (browser)                        │
            │   iOS Safari · Android Chrome · Desktop · Tablet · Large TV   │
            └────────────────────────────────┬────────────────────────────┘
                                             │ HTTPS (TLS 1.3)
                                             ▼
                          ┌──────────────────────────────────┐
                          │             Next.js 14           │
                          │       apps/web (Vercel or self)   │
                          │   • App Router (RSC + client)    │
                          │   • shadcn/ui primitives         │
                          │   • React Query for live data    │
                          └─────────────────┬────────────────┘
                                            │ REST + Bearer JWT
                                            ▼
                          ┌──────────────────────────────────┐
                          │             NestJS 10            │
                          │   apps/api (Node 20+, Docker)    │
                          │   • modular · RBAC · Swagger    │
                          │   • global Throttler + Helmet    │
                          └─────────────────┬────────────────┘
                                            │ Prisma
                                            ▼
                          ┌──────────────────────────────────┐
                          │        PostgreSQL 16             │
                          └──────────────────────────────────┘

             Side modules                                AI providers
  ┌───────────────────────────────┐             ┌──────────────────────────────┐
  │ • Email (SES / Postmark v0.2) │             │ • Stub (always present)      │
  │ • Push (Firebase v0.2)        │             │ • OpenAI  (when key is set)  │
  │ • Object storage (local→S3)   │             │ • Anthropic (placeholder)    │
  └───────────────────────────────┘             │ • Local LLM (placeholder)    │
                                                └──────────────────────────────┘
```

## 2. Repository layout

Monorepo, npm workspaces.

```
amalyatri/
├── apps/
│   ├── api/           # NestJS — REST API
│   └── web/           # Next.js — Yatri-facing app
├── packages/
│   ├── prisma/        # Prisma schema, migrations, seed
│   ├── shared/        # Pure logic shared between client + server
│   ├── types/         # Cross-package TypeScript types (planned v0.2)
│   ├── ui/            # Cross-package React primitives (planned v0.2)
│   └── config/        # Typed env + brand tokens (planned v0.2)
└── docs/
```

## 3. Module boundaries (apps/api)

```
src/modules/
├── auth/                 ← JWT, password, refresh tokens, guards, RBAC
├── users/                ← profiles for Yatri / Doctor / Guide / Therapist
├── wellness-timeline/    ← retreats, assessments, goals, plans, timeline
├── doctor-connect/       ← messaging + consultations
├── communities/          ← moderated circles
├── knowledge/            ← articles, recipes, yoga, podcasts
├── events/               ← live sessions, retreats
├── notifications/        ← in-app + email + push (channel-agnostic)
├── ai-assistant/         ← provider abstraction + conversation persistence
├── admin/                ← RBAC admin endpoints
└── health/               ← liveness + readiness probes
```

Each module has `*.controller.ts` (HTTP surface), `*.service.ts` (domain logic), `dto.ts` (validation), `*.module.ts` (wiring). All modules import `PrismaService` from `src/prisma/`.

## 4. Cross-cutting concerns

- **Auth:** JWT access token (15m) + opaque refresh token (30d) stored as a SHA-256 hash in `refresh_tokens`. `JwtAuthGuard` extracts the user; `RolesGuard` enforces role permissions declared via `@Roles()` decorator.
- **Validation:** `class-validator` + `ValidationPipe({ whitelist: true, transform: true })` — invalid bodies are rejected with 400 before hitting the service.
- **Errors:** `HttpExceptionFilter` produces consistent envelope with `statusCode`, `method`, `path`, `timestamp`, plus payload from the original exception.
- **Rate limiting:** `@nestjs/throttler` at 120 req / 60s / IP; bump down for write endpoints in v0.2.
- **Swagger:** mounted at `/api/docs` with bearer-auth scheme.
- **CORS:** explicit allowlist from `CORS_ORIGINS` env (comma-separated).

## 5. Data layer

- **PostgreSQL 16** with Prisma 5.
- **IDs:** `cuid()` for short URL-safe IDs (functionally UUID-ish).
- **Audit:** every model carries `createdAt`, `updatedAt`, and `deletedAt` (soft delete) where appropriate.
- **Enums** for fixed vocabularies (`UserRole`, `RetreatType`, `PlanKind`, …).
- **JSON blobs** (Prisma `Json`) for truly flexible payloads (e.g., plan content, assessment metrics).

Indexes are placed on query-relevant columns (e.g., `(yatriUserId, occurredAt)` on `timeline_events`).

## 6. AI provider abstraction

`AiProvider` interface in `src/modules/ai-assistant/ai.provider.ts`. One impl per provider:

- `StubProvider` — deterministic, keyword-matched, always works (curated responses for yoga, sleep, breath, meditation, recipe, panchakarma, weight, pain, fallback greeting).
- `OpenAiProvider` — fails closed honestly when `AI_API_KEY` is missing.
- `AnthropicProvider`, `LocalProvider` — placeholders; the real HTTP plumbing is a tracked task.

Every response gets `SAFETY_DISCLAIMER` appended.

## 7. Web architecture

- **Next.js 14 App Router.** Public routes: `/`, `/login`, `/register`, `/forgot-password`. Protected routes under `app/(app)` with a layout that gates on the auth context.
- **State:** server components for SEO/landing; client components for live data via React Query.
- **Styling:** Tailwind + design tokens in `tailwind.config.ts` (forest/clay/sun palette) + `globals.css` for component classes (`btn-cta`, `dotted-divider`, `glass-card`).
- **Fonts:** Cormorant Garamond (display), Inter (body) — loaded via `next/font/google`.
- **API client:** `lib/api.ts` wraps `fetch` with bearer-token injection and one-shot refresh.
- **Auth context:** `lib/auth-context.tsx` restores session on app boot by hitting `/users/me`.

## 8. Cross-package primitives

`packages/ui`, `packages/types`, `packages/shared`, `packages/config` are reserved for v0.2; today the web app has all primitives in `apps/web/components/ui`. Primitives are written to be portable — when extracted they will move with no API change.

## 9. Observability (planned v0.2)

- Structured logs (`nestjs-pino`).
- Tracing (OpenTelemetry, OTLP → Tempo/Honeycomb).
- Metrics (Prom client, `/metrics`).
- Frontend error reporting (Sentry).
- Backend health probes already in place (`/health`, `/health/ready`).

## 10. Security

- **Passwords:** bcrypt at 10 rounds.
- **Refresh tokens:** opaque random (48 bytes base64url), SHA-256 hashed at rest.
- **JWT:** access tokens signed with HS256 (default); rotate via env. Service is ready to swap to RS256.
- **RBAC:** `RolesGuard` + `@Roles()` decorator.
- **Throttler:** enabled globally.
- **Validation:** strict whitelist + strip-unknown fields.
- **CORS:** explicit allowlist.
- **No secrets in code:** every secret is sourced from `process.env` via `ConfigModule`.
