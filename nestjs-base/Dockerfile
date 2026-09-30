# syntax=docker/dockerfile:1

# ============================================================================
# Stage 1: deps — cài toàn bộ dependencies (kể cả dev) để build
# ============================================================================
FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ============================================================================
# Stage 2: build — compile TypeScript, sau đó loại bỏ devDependencies
# ============================================================================
FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build && npm prune --omit=dev

# ============================================================================
# Stage 3: runtime — image gọn, chạy bằng user không phải root
# ============================================================================
FROM node:22-bookworm-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app

# tini: xử lý tín hiệu (SIGTERM) đúng cách cho graceful shutdown
RUN apt-get update \
  && apt-get install -y --no-install-recommends tini \
  && rm -rf /var/lib/apt/lists/*

COPY --from=build --chown=node:node /app/package.json ./
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:'+(process.env.PORT||3000)+'/api/health/live',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["node", "dist/main.js"]
