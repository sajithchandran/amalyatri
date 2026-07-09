# Amal Yatri

> _The lifelong digital wellness companion for every guest of Amal Tamara Ayurveda._

Amal Yatri extends the transformational wellness journey of Amal Tamara
beyond the physical stay — into a lifelong, premium, AI-augmented digital
ecosystem connecting guests (Yatris) with their doctors, wellness plans,
and a moderated community.

**Not** a hospital EMR. **Not** a patient portal. **Not** a social network.
A premium wellness companion.

---

## Repository layout

```
amalyatri/
├── apps/
│   ├── web/        # Next.js 14 (App Router) — Yatri-facing app
│   └── api/        # NestJS 10 — REST API
├── packages/
│   ├── prisma/     # Prisma schema, migrations, seed
│   ├── shared/     # Pure logic shared across apps
│   ├── types/      # Cross-package TypeScript types
│   ├── ui/         # Shared React primitives (extended shadcn/ui)
│   └── config/     # Typed env + brand tokens
├── docs/           # Product spec, architecture, API, deployment
├── docker/         # Local PostgreSQL + app stack
└── .github/        # CI, PR templates, contributing
```

---

## Quick start

```bash
# 1. Install dependencies (workspaces)
npm install

# 2. Generate Prisma client
npm run db:generate

# 3. Start local Postgres
npm run docker:up

# 4. Run migrations + seed
npm run db:migrate
npm run db:seed

# 5. Start everything in dev
npm run dev
```

- Web: http://localhost:3000
- API: http://localhost:3001/api/v1
- API docs (Swagger): http://localhost:3001/api/docs

---

## Stack

| Layer        | Tech                                                      |
| ------------ | --------------------------------------------------------- |
| Frontend     | Next.js 14 (App Router), React 18, TypeScript, Tailwind   |
| UI kit       | shadcn/ui, Radix UI, Framer Motion, Lucide icons          |
| Forms        | React Hook Form + Zod                                     |
| Backend      | NestJS 10, TypeScript, REST, Swagger                      |
| Database     | PostgreSQL 16, Prisma 5 ORM                               |
| Auth         | JWT (access + refresh), RBAC guards, bcrypt               |
| AI           | Pluggable provider (OpenAI/Anthropic/local LLM-ready)     |
| Storage      | Local disk now → S3-compatible later (MinIO/AWS)          |

See `docs/architecture.md` for the full design.

---

## Modules

1. Landing website
2. Authentication & profile
3. Yatri dashboard
4. Wellness timeline
5. Doctor Connect
6. Wellness plans
7. Community
8. Knowledge library
9. AI wellness assistant
10. Events
11. Notifications
12. Admin & Doctor portals

---

## Contributing

Read `docs/contributing.md`. Keep code modular, documented, and calm.

---

## License

© 2026 Amal Tamara Ayurveda. All rights reserved.
