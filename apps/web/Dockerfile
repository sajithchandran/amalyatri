# ──────────────────────────────────────────────────────────────────────────────
# Amal Yatri — Next.js Web  (multi-stage build)
#   Stage 1 — deps     : workspace install
#   Stage 2 — builder  : next build
#   Stage 3 — runtime  : production (next start)
#   Stage 4 — dev      : dev server with hot reload (compose default)
# ──────────────────────────────────────────────────────────────────────────────

# ─────────────── Stage 1: deps ───────────────
FROM node:22-alpine AS deps
WORKDIR /repo

COPY package.json package-lock.json ./
COPY packages/ ./packages/
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/

RUN npm ci --workspace=apps/web --include-workspace-root \
    && npm cache clean --force

# ─────────────── Stage 2: builder ────────────
FROM deps AS builder
WORKDIR /repo

COPY packages/ ./packages/
COPY apps/web/ ./apps/web/

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN cd apps/web && npm run build

# ─────────────── Stage 3: runtime ────────────
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /repo/apps/web/.next ./.next
COPY --from=builder /repo/apps/web/public ./public
COPY --from=builder /repo/apps/web/package.json ./package.json
COPY --from=builder /repo/apps/web/next.config.js ./next.config.js
COPY --from=builder /repo/node_modules ./node_modules
COPY --from=builder /repo/packages ./packages

EXPOSE 3000
USER node
CMD ["npx", "next", "start", "-p", "3000"]

# ─────────────── Stage 4: dev (default) ──────
FROM deps AS dev
WORKDIR /repo/apps/web
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /repo/apps/web/ ./
COPY --from=builder /repo/packages ./packages

EXPOSE 3000
CMD ["npm", "run", "dev"]
