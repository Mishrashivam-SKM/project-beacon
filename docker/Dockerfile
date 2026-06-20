# ── Stage 1: Build ──
FROM node:24-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build if needed)
RUN npm ci

# Copy application source code
COPY src/ ./src/

# ── Stage 2: Production ──
FROM node:24-alpine AS production

# Set working directory
WORKDIR /app

# Set node environment
ENV NODE_ENV=production

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy source code from builder
COPY --from=builder /app/src ./src

# Create a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
