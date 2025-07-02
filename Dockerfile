FROM node:24-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Accept build-time metadata
ARG COMMIT_HASH
ARG VERSION

ENV COMMIT_HASH=${COMMIT_HASH}
ENV VERSION=${VERSION}

FROM base AS build
WORKDIR /app
COPY . /app

RUN corepack enable
RUN apk add --no-cache python3 alpine-sdk
RUN pnpm install --prod --frozen-lockfile
RUN pnpm deploy --filter=@imput/cobalt-api --prod /prod/api

FROM base AS api
WORKDIR /app

ARG COMMIT_HASH
ARG VERSION

ENV COMMIT_HASH=${COMMIT_HASH}
ENV VERSION=${VERSION}

COPY --from=build --chown=node:node /prod/api /app

USER node

EXPOSE 9000

CMD [ "node", "src/cobalt" ]
