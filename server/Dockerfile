FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app


ARG GOOGLE_GEOCODE_API_KEY
ARG GOOGLE_PLACES_API_KEY
ARG MONGODB_URI
ARG GMAIL_2F_AUTH_APP_PASS

ENV GOOGLE_GEOCODE_API_KEY=${GOOGLE_GEOCODE_API_KEY}
ENV GOOGLE_PLACES_API_KEY=${GOOGLE_PLACES_API_KEY}
ENV MONGODB_URI=${MONGODB_URI}
ENV GMAIL_2F_AUTH_APP_PASS=${GMAIL_2F_AUTH_APP_PASS}

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build-cache
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build-cache /app/build /app/build
EXPOSE 8000
CMD [ "pnpm", "start" ]