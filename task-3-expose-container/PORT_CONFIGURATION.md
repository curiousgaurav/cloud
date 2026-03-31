# Task 3: Expose Docker Container with Node.js Application

## Objective
Host a Node.js application in a Docker container and expose it through port mapping to access from the host machine.

## What is Port Mapping?

Port mapping connects a port on your host machine to a port inside the container:
```
Host Port : Container Port
8080      : 8080
3000      : 8080
9000      : 3000
```

## Files Included

- **Dockerfile**: Docker configuration with port exposure
- **app.js**: Node.js Express application with multiple endpoints
- **package.json**: Dependencies (Express, body-parser)

## Building the Container

### Step 1: Navigate to Task 3 Directory
```bash
cd task-3-expose-container
```

### Step 2: Build the Image
```bash
docker build -t curiousgaurav-exposed-app:1.0 .
```

### Step 3: Verify Build
```bash
docker images | grep curiousgaurav-exposed-app
```

## Running the Container with Port Mapping

### Option 1: Basic Port Mapping
```bash
# Map host port 8080 to container port 8080
docker run -d -p 8080:8080 --name exposed-app curiousgaurav-exposed-app:1.0

# Access at http://localhost:8080
```

### Option 2: Custom Port Mapping
```bash
# Map host port 3000 to container port 8080
docker run -d -p 3000:8080 --name exposed-app curiousgaurav-exposed-app:1.0

# Access at http://localhost:3000
```

### Option 3: Multiple Port Mappings
```bash
# Expose on multiple ports
docker run -d \
  -p 8080:8080 \
  -p 3000:8080 \
  -p 5000:8080 \
  --name exposed-app \
  curiousgaurav-exposed-app:1.0

# Access from any: http://localhost:8080, http://localhost:3000, http://localhost:5000
```

### Option 4: With Custom Environment Variables
```bash
docker run -d \
  -p 8080:8080 \
  -e PORT=8080 \
  -e NODE_ENV=production \
  -e APP_NAME="My Production App" \
  --name exposed-app \
  curiousgaurav-exposed-app:1.0
```

### Option 5: Full Command with Logging
```bash
docker run -d \
  -p 8080:8080 \
  --name exposed-app \
  --restart unless-stopped \
  --log-driver json-file \
  --log-opt max-size=10m \
  curiousgaurav-exposed-app:1.0

# View logs
docker logs -f exposed-app
```

## Accessing the Application

### Using curl (Command Line)
```bash
# Health check
curl http://localhost:8080/health

# Get app info
curl http://localhost:8080/api/info

# Get status
curl http://localhost:8080/status

# Get server details
curl http://localhost:8080/api/server-details

# Post data to echo endpoint
curl -X POST http://localhost:8080/api/echo \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello Docker"}'

# Get metrics
curl http://localhost:8080/metrics
```

### Using Browser
Open these URLs in your browser:
- http://localhost:8080/ (Welcome page)
- http://localhost:8080/health (Health check)
- http://localhost:8080/status (Server status)
- http://localhost:8080/api/info (API information)
- http://localhost:8080/api/server-details (Server details)
- http://localhost:8080/metrics (Performance metrics)

### Using PowerShell (Windows)
```powershell
# Basic request
Invoke-WebRequest -Uri http://localhost:8080/health | Select-Object -ExpandProperty Content | ConvertFrom-Json | Format-Table

# Health check
(Invoke-WebRequest -Uri http://localhost:8080/health).Content | ConvertFrom-Json

# Status
(Invoke-WebRequest -Uri http://localhost:8080/status).Content | ConvertFrom-Json
```

## Container Management

### Verify Container is Running
```bash
docker ps

# Output will show:
# CONTAINER ID   IMAGE                            PORTS                  NAMES
# abc123...      curiousgaurav-exposed-app:1.0   0.0.0.0:8080->8080/tcp exposed-app
```

### Check Port Mapping
```bash
docker port exposed-app

# Output: 8080/tcp -> 0.0.0.0:8080
```

### View Container Logs
```bash
# View all logs
docker logs exposed-app

# Follow logs in real-time
docker logs -f exposed-app

# View last 50 lines
docker logs --tail 50 exposed-app

# View logs with timestamps
docker logs -t exposed-app
```

### Enter Container Shell
```bash
docker exec -it exposed-app /bin/sh

# Inside container, test connectivity
curl http://localhost:8080/health
```

### Get Container Information
```bash
docker inspect exposed-app

# Pretty print specific info
docker inspect -f '{{.NetworkSettings.IPAddress}}' exposed-app
docker inspect -f '{{.State.Running}}' exposed-app
docker inspect -f '{{json .NetworkSettings.Ports}}' exposed-app | python -m json.tool
```

### Container Statistics
```bash
# Real-time resource usage
docker stats exposed-app

# One-time snapshot
docker stats --no-stream exposed-app
```

## Port Mapping Scenarios

### Scenario 1: Change Port After Container Created
```bash
# Stop current container
docker stop exposed-app
docker rm exposed-app

# Run with different port
docker run -d -p 9000:8080 --name exposed-app curiousgaurav-exposed-app:1.0

# Now access at http://localhost:9000
```

### Scenario 2: Port Already in Use
```bash
# Error: bind: address already in use
# Solution 1: Use different host port
docker run -d -p 8081:8080 --name exposed-app curiousgaurav-exposed-app:1.0

# Solution 2: Find and stop the process using port 8080
lsof -i :8080  # macOS/Linux
netstat -ano | findstr :8080  # Windows
```

### Scenario 3: Multiple Containers on Different Ports
```bash
# Run multiple instances
docker run -d -p 8080:8080 --name app1 curiousgaurav-exposed-app:1.0
docker run -d -p 8081:8080 --name app2 curiousgaurav-exposed-app:1.0
docker run -d -p 8082:8080 --name app3 curiousgaurav-exposed-app:1.0

# Access each:
curl http://localhost:8080/
curl http://localhost:8081/
curl http://localhost:8082/
```

## Dockerfile Port Exposure Analysis

```dockerfile
EXPOSE 8080 3000 5000
```
- Documents which ports the app uses
- Does NOT actually expose ports
- Port mapping (-p flag) is required to access from host

```dockerfile
ENV PORT=8080
```
- Sets default port to 8080

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get(...)"
```
- Automatic health checking every 30 seconds
- Container auto-restarts if health check fails 3 times

## Testing the Application

### Test 1: Connection
```bash
docker run -d -p 8080:8080 --name exposed-app curiousgaurav-exposed-app:1.0
sleep 2  # Wait for startup
curl http://localhost:8080/health
```

### Test 2: Port Isolation
```bash
# Verify port mapping doesn't interfere
docker run -d -p 8080:8080 --name app1 curiousgaurav-exposed-app:1.0
docker run -d -p 8081:8080 --name app2 curiousgaurav-exposed-app:1.0

curl http://localhost:8080/api/server-details  # From app1
curl http://localhost:8081/api/server-details  # From app2
```

### Test 3: Data Persistence Check
```bash
# Post to echo endpoint
curl -X POST http://localhost:8080/api/echo \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

### Test 4: Resource Monitoring
```bash
# Monitor container resources while under load
docker stats exposed-app

# In another terminal, generate load
for i in {1..100}; do curl http://localhost:8080/status; done
```

## Cleanup

### Stop Container
```bash
docker stop exposed-app
```

### Remove Container
```bash
docker rm exposed-app
```

### Remove Image
```bash
docker rmi curiousgaurav-exposed-app:1.0
```

### Remove All
```bash
docker stop exposed-app
docker rm exposed-app
docker rmi curiousgaurav-exposed-app:1.0
```

## Common Issues & Solutions

### Issue: Connection Refused
```bash
# Check if container is running
docker ps

# Check logs
docker logs exposed-app

# Solution: Wait a moment for server to start
sleep 3
curl http://localhost:8080/
```

### Issue: Port Already in Use
```bash
# Find what's using port 8080
netstat -ano | findstr :8080  # Windows
lsof -i :8080  # macOS/Linux

# Solution: Use different port
docker run -d -p 8081:8080 --name exposed-app curiousgaurav-exposed-app:1.0
```

### Issue: Cannot Access from Another Machine
```bash
# Correct: Bind to all interfaces
docker run -d -p 0.0.0.0:8080:8080 --name exposed-app curiousgaurav-exposed-app:1.0

# Access from other machine
curl http://<host-machine-ip>:8080/health
```

### Issue: Changes to Code Not Reflecting
```bash
# Rebuild and rerun
docker stop exposed-app
docker rm exposed-app
docker build -t curiousgaurav-exposed-app:1.0 .
docker run -d -p 8080:8080 --name exposed-app curiousgaurav-exposed-app:1.0
```

## Key Concepts Summary

| Concept | Explanation |
|---------|-------------|
| **Port Mapping** | Connect host port to container port using `-p` |
| **EXPOSE** | Documents ports, doesn't actually expose them |
| **-p flag** | Actually exposes ports to the host |
| **Host Port** | Port accessible from your machine |
| **Container Port** | Port where app listens inside container |
| **Port Binding** | The connection between host port and container port |

## Quick Reference

```bash
# Build
docker build -t curiousgaurav-exposed-app:1.0 .

# Run with port mapping
docker run -d -p 8080:8080 --name exposed-app curiousgaurav-exposed-app:1.0

# Test
curl http://localhost:8080/health

# Monitor
docker logs -f exposed-app
docker stats exposed-app

# Cleanup
docker stop exposed-app
docker rm exposed-app
docker rmi curiousgaurav-exposed-app:1.0
```
