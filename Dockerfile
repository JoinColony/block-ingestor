# Declare the build argument at the top
ARG BUILD_TARGET=main-chain

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

# Proxy Chain Stage
FROM base AS proxy-chain
WORKDIR /workspace
COPY --from=build /workspace /workspace
WORKDIR /workspace/apps/proxy-chain
CMD ["pnpm", "--filter", "@joincolony/proxy-chain", "prod"]

# Final stage that will be used
FROM ${BUILD_TARGET} AS final

# Add labels and echo build info
LABEL build_type=${BUILD_TARGET}
RUN echo "🏗️ Building ${BUILD_TARGET} version of block-ingestor" && \
    echo "📦 Final build target: ${BUILD_TARGET}"

# Keep existing CMD from the selected stage

