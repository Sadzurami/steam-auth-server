FROM node:20-alpine AS base-img
WORKDIR /app
COPY package.json yarn.lock ./

FROM base-img AS prod-deps
RUN yarn install --frozen-lockfile --production

FROM prod-deps AS dev-deps
RUN yarn install --frozen-lockfile

FROM dev-deps AS build
COPY . .
RUN yarn run build

FROM base-img AS production
COPY --chown=node:node --from=prod-deps /app/node_modules /app/node_modules
COPY --chown=node:node --from=build /app/dist /app/dist

ENV NODE_ENV=production
EXPOSE 3000

HEALTHCHECK \
  --timeout=10s \
  --interval=30s \
  --start-period=5s \
  CMD wget --no-verbose --tries=1 --spider "http://localhost:3000/status" || sh -c "kill -s 15 -1 && (sleep 10; kill -s 9 -1)"

USER node
ENTRYPOINT ["node", "dist/main"]
