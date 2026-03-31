# Task 2: Create Docker Container with Dockerfile

## Objective
Create a custom Docker container using a Dockerfile with your name and basic Node.js functionality.

## Files Included

- **Dockerfile**: Docker configuration file
- **server.js**: Node.js Express application
- **package.json**: Node.js dependencies

## Prerequisites

- Docker installed
- Node.js installed (optional, for local testing)

## Building the Docker Container

### Step 1: Navigate to Task 2 Directory
```bash
cd task-2-dockerfile-container
```

### Step 2: Build the Docker Image
```bash
# Build with default name
docker build -t curiousgaurav-app:1.0 .

# Build with custom name and tag
docker build -t my-docker-app:latest .

# Build with verbose output
docker build -t curiousgaurav-app:1.0 . --progress=plain
```

### Step 3: Verify the Image
```bash
# List images to verify build
docker images

# Inspect image details
docker inspect curiousgaurav-app:1.0
```

## Running the Container

### Step 1: Run the Container
```bash
# Run with default settings
docker run -d --name my-app curiousgaurav-app:1.0

# Run with port mapping
docker run -d -p 3000:3000 --name my-app curiousgaurav-app:1.0

# Run with environment variable override
docker run -d -p 3000:3000 -e APP_NAME="My Custom App" --name my-app curiousgaurav-app:1.0
```

### Step 2: Check if Container is Running
```bash
# List running containers
docker ps

# View logs
docker logs my-app

# Follow logs in real-time
docker logs -f my-app
```

### Step 3: Access the Application

Using curl (if installed):
```bash
# Health check
curl http://localhost:3000/health

# Get app info
curl http://localhost:3000/api/info

# Welcome endpoint
curl http://localhost:3000/
```

Or open in browser:
- http://localhost:3000/

## Dockerfile Explanation

```dockerfile
FROM node:14-alpine
```
- Uses Alpine Linux-based Node.js image (lightweight)

```dockerfile
WORKDIR /app
```
- Sets working directory inside container

```dockerfile
COPY package*.json ./
```
- Copies package.json and package-lock.json (if exists)

```dockerfile
RUN npm install
```
- Installs dependencies

```dockerfile
COPY . .
```
- Copies application code

```dockerfile
EXPOSE 3000
```
- Documents that app listens on port 3000

```dockerfile
ENV NODE_ENV=production
ENV APP_NAME=curiousgaurav-app
```
- Sets environment variables

```dockerfile
CMD ["node", "server.js"]
```
- Default command to run when container starts

## Common Tasks

### View Container Logs
```bash
docker logs my-app
docker logs -f my-app  # Follow logs
```

### Enter Container Shell
```bash
docker exec -it my-app /bin/sh
```

### Stop Container
```bash
docker stop my-app
```

### Start Container Again
```bash
docker start my-app
```

### Remove Container
```bash
docker rm my-app
```

### Remove Image
```bash
docker rmi curiousgaurav-app:1.0
```

## Rebuilding After Code Changes

```bash
# Make changes to server.js or package.json
# Stop and remove old container
docker stop my-app
docker rm my-app

# Rebuild image
docker build -t curiousgaurav-app:1.0 .

# Run new container
docker run -d -p 3000:3000 --name my-app curiousgaurav-app:1.0
```

## Troubleshooting

### Container exits immediately
```bash
# View logs to see error
docker logs my-app

# Common issues:
# - Port already in use: docker run -p 3001:3000 ...
# - Dependencies not installed: Check npm install step in Dockerfile
```

### Cannot connect to localhost:3000
```bash
# Verify container is running
docker ps

# Check port mapping
docker port my-app

# Try different port
docker run -d -p 3001:3000 --name my-app curiousgaurav-app:1.0
```

### Build fails with "cannot find module"
```bash
# Ensure package.json is in current directory
ls -la

# Rebuild with clean cache
docker build -t curiousgaurav-app:1.0 . --no-cache
```

## Environment Variables

You can override environment variables when running:

```bash
docker run -d \
  -p 3000:3000 \
  -e NODE_ENV=development \
  -e APP_NAME="Custom App Name" \
  --name my-app \
  curiousgaurav-app:1.0
```

## Complete Workflow Example

```bash
# 1. Build image
docker build -t curiousgaurav-app:1.0 .

# 2. Run container
docker run -d -p 3000:3000 --name my-app curiousgaurav-app:1.0

# 3. Check health
docker exec my-app curl http://localhost:3000/health

# 4. View analytics
curl http://localhost:3000/api/info

# 5. Clean up
docker stop my-app
docker rm my-app
docker rmi curiousgaurav-app:1.0
```
