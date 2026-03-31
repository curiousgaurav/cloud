# Use official Node.js runtime as base image
FROM node:14-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application
COPY . .

# Expose multiple ports
EXPOSE 8080 3000 5000

# Environment setup
ENV PORT=8080
ENV NODE_ENV=production
ENV APP_NAME=curiousgaurav-exposed-app

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:' + process.env.PORT, (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["node", "app.js"]
