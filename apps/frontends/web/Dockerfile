
# Use a Node.js image
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy the root package.json and pnpm workspace configuration
COPY pnpm-lock.yaml ./
COPY package.json ./
COPY pnpm-workspace.yaml ./

# Install dependencies
RUN pnpm i --frozen-lockfile

# Copy the rest of the monorepo into the container
COPY . .



# Build the Next.js app
WORKDIR /app/apps/frontends/web
RUN npm i -g pnpm
RUN pnpm i --frozen-lockfile
RUN pnpm build

# Start the app
CMD ["pnpm", "dev-docker"]