# ---- Build Stage ------------------------------------------------------------
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install all dependencies (including dev) needed for the build
COPY package.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the Vite client (outputs to ../dist which resolves to /app/dist)
RUN npm run build

# ---- Production Stage -------------------------------------------------------
FROM node:18-alpine AS production

# Set working directory
WORKDIR /app

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Install only production dependencies
COPY package.json ./
RUN npm install --omit=dev

# Copy the compiled frontend assets and the server source
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server

# Expose the port the Express server will listen on
EXPOSE 3000

# Start the Express server (it should bind to process.env.PORT || 3000 and 0.0.0.0)
CMD ["npm", "start"]