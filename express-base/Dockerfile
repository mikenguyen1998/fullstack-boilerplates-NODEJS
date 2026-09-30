# syntax=docker/dockerfile:1

ARG NODE_VERSION=24-alpine

# ---------- deps: all dependencies (for build) ----------
FROM node:${NODE_VERSION} AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---------- build: generate Prisma client + compile TS ----------
FROM node:${NODE_VERSION} AS build
WORKDIR /app
# prisma.config.ts requires DATABASE_URL to be set; a placeholder is enough for `generate`.
ENV DATABASE_URL=postgresql://placeholder:placeholder@localhost:5432/placeholder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate && npm run build

# ---------- prod-deps: production dependencies only ----------
FROM node:${NODE_VERSION} AS prod-deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# ---------- runner ----------
FROM node:${NODE_VERSION} AS runner
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000

RUN apk add --no-cache tini

COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --chown=node:node package.json ./
# Migrations: run `npx prisma migrate deploy` from a job / CI step
# (the `prisma` CLI is a devDependency and is not shipped in this image).
COPY --chown=node:node prisma ./prisma

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${PORT}/health > /dev/null || exit 1

# tini forwards SIGTERM/SIGINT so graceful shutdown works.
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/server.js"]
