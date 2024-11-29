FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV COREPACK_DISABLE_PROMPT=1
RUN corepack enable
RUN corepack use pnpm@9.5.0

FROM base AS build
WORKDIR /workspace
COPY . /workspace
RUN pnpm install --frozen-lockfile


# Main Chain Stage
FROM base AS main-chain
WORKDIR /workspace
COPY --from=build /workspace /workspace
WORKDIR /workspace/apps/main-chain
CMD ["pnpm", "--filter", "@joincolony/main-chain", "prod"]

