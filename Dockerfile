FROM node:20-alpine AS base
ENV YARN_HOME="/yarn"
ENV PATH="$YARN_HOME:$PATH"
COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=yarn,target=/yarn/cache yarn install --production --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=yarn,target=/yarn/cache yarn install --frozen-lockfile
RUN yarn run build

FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s \
  CMD wget --no-verbose --tries=1 --spider "http://localhost:3000/status" || sh -c "kill -s 15 -1 && (sleep 10; kill -s 9 -1)"

ENTRYPOINT [ "yarn", "start:prod" ]
