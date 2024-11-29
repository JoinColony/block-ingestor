FROM node:20-slim
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Set the working directory to the monorepo root
WORKDIR /workspace

# Copy necessary files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json tsconfig.base.json .npmrc ./
COPY scripts ./scripts
COPY .env.example ./.env.example
COPY .env ./.env
COPY apps/main-chain ./apps/main-chain
COPY apps/main-chain/.env ./apps/main-chain/.env
COPY packages/graphql ./packages/graphql

# Install dependencies and filter for scoped package
RUN pnpm install --frozen-lockfile

# the command that starts our app
CMD ["pnpm", "--filter", "@joincolony/main-chain", "dev"]
