# Use Node.js base image
FROM node:22
# Set working directory
WORKDIR /app
# Copy package manager files first for better caching
COPY pnpm-lock.yaml ./
COPY package.json ./
# Install dependencies
RUN npm install -g pnpm@latest && pnpm install
# Copy the rest of the code
COPY . .
# Generate Prisma client for the correct targets
RUN cd packages/backend && npx prisma generate
# Build and start the application
RUN pnpm build
CMD ["pnpm", "start"]
