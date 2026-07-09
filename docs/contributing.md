# Contributing to Amal Yatri

## TL;DR
1. Branch from `main`
2. Make focused commits with conventional prefixes (`feat:`, `fix:`, `chore:`, `docs:`)
3. Run `npm run lint` + `npm run build` locally
4. Open a PR with context — what + why + screenshots for UI

## Code conventions

- **TypeScript everywhere.** No `any` unless annotated with reason.
- **React:** function components, hooks only. Prefer server components when there's no interactivity.
- **Naming:** camelCase for variables/functions, PascalCase for types/components, UPPER_SNAKE for enums.
- **Comments:** why, not what. Avoid noise.
- **Errors:** throw `NotFoundException`, `ConflictException`, etc.; let the filter format them.

## Directory hygiene

- All page routes live in `apps/web/app/**/page.tsx`.
- Reusable UI primitives live in `apps/web/components/ui` or `packages/ui` (planned v0.2).
- Landing-page sections live in `apps/web/components/landing`.
- App-shell sections live in `apps/web/components/app`.

## Database migrations

```bash
npm run db:migrate     # dev — opens Prisma Studio on conflict
npm run db:generate    # regenerate client after schema changes
```

Never edit a migration after it's been applied to a shared DB.

## Working on AI

The platform commits to a safety stance: **never diagnose, always escalate.** The system prompt in `ai-assistant.service.ts` is the source of truth. If you propose changes, justify them in the PR.

## PR template

```
## What
- … bullet …

## Why
- … bullet …

## Verification
- [ ] Unit tests added
- [ ] Manual smoke (URL/screenshots)
- [ ] Docs updated (if applicable)

## Screenshots
```

## Releases

`main` is always deployable. Tags follow `vX.Y.Z` semver. Hotfixes go through PRs like everything else.
