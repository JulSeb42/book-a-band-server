# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN pnpm build

# Expose the port (make sure this matches your .env PORT)
EXPOSE 5005

# Start the server
CMD ["pnpm", "start"]
