FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn run build
RUN rm -rf src

ENV NODE_ENV=production
ENV PORT=3000

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \ 
CMD curl -f http://localhost:3000/health || exit 1

ENTRYPOINT yarn run start:prod
