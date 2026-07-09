# ──────────────────────────────────────────────────────────────────────────────
# Amal Yatri — NestJS API  (multi-stage build)
#   Stage 1 — deps     : install all monorepo deps
#   Stage 2 — builder  : prisma generate + nest build
#   Stage 3 — runtime  : production-only deps, dist output
#   Stage 4 — dev      : dev image with ts-node + watch (compose default)
# ──────────────────────────────────────────────────────────────────────────────

# ─────────────── Stage 1: deps ───────────────
FROM node:22-alpine AS deps
WORKDIR /repo

# Copy workspace root first (for npm workspaces resolution)
COPY package.json package-lock.json ./
COPY packages/ ./packages/
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/

# Install ALL workspace deps (api needs @amalyatri/prisma workspace sibling)
RUN npm ci --workspace=apps/api --include-workspace-root \
    && npm cache clean --force

# ─────────────── Stage 2: builder ────────────
FROM deps AS builder
WORKDIR /repo

COPY packages/prisma/ ./packages/prisma/
COPY apps/api/ ./apps/api/

# Generate Prisma client (workspace package)
RUN cd packages/prisma && npx prisma generate

# Build the API
RUN cd apps/api && npm run build

# ─────────────── Stage 3: runtime ────────────
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Copy built artifacts + Prisma client + workspace package
COPY --from=builder /repo/apps/api/dist ./dist
COPY --from=builder /repo/apps/api/package.json ./package.json
COPY --from=builder /repo/packages/prisma ./packages/prisma/
COPY --from=builder /repo/packages ./packages
COPY --from=builder /repo/package.json /repo/package-lock.json* ./
RUN npm ci --omit=dev --workspace=apps/api --include-workspace-root \
    && npm cache clean --force

# Make uploads dir for local storage
RUN mkdir -p /app/uploads

EXPOSE 3001
USER node
CMD ["node", "dist/main.js"]

# ─────────────── Stage 4: dev (default) ──────
FROM deps AS dev
WORKDIR /repo/apps/api
ENV NODE_ENV=development

# Re-copy source (kept out of deps stage to keep cache hits narrow)
COPY --from=builder /repo/apps/api/ ./

# Prisma shared package needs to be present at runtime too
COPY --from=builder /repo/packages ./packages

EXPOSE 3001
CMD ["npm", "run", "start:dev"]
