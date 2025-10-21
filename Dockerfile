# ---- Base Node image ----
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# ---- Dependencies stage ----
FROM base AS deps
RUN npm ci

# ---- Build stage ----
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
CMD ls -la
RUN npm run build

# ---- Production stage ----
FROM node:20-alpine AS prod
WORKDIR /app

# Copy only package files and install production deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy build output and necessary files
COPY --from=build /app/dist ./dist
COPY .env ./

# Expose NestJS port
EXPOSE 3000

# Run the app
CMD ["node", "dist/main"]