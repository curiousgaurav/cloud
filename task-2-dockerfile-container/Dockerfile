# Use official Node.js runtime as base image
FROM node:14-alpine

# Set working directory in container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV APP_NAME=curiousgaurav-app

# Run the application
CMD ["node", "server.js"]
