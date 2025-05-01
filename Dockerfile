FROM node:20-alpine AS base

COPY . /app
WORKDIR /app

FROM base AS deps
RUN yarn install --production --frozen-lockfile

FROM deps AS build
RUN yarn install --frozen-lockfile
RUN yarn run build

FROM base AS production
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist

ENV NODE_ENV=production
EXPOSE 3000

HEALTHCHECK \
  --timeout=10s \
  --interval=30s \
  --start-period=5s \
  CMD wget --no-verbose --tries=1 --spider "http://localhost:3000/status" || sh -c "kill -s 15 -1 && (sleep 10; kill -s 9 -1)"

ENTRYPOINT [ "node", "dist/main" ]
