# Quick Start Guide

## ⚡ 3-Minute Setup

### Prerequisites
- Docker installed and running

### Task 1: Learn Docker Commands (5 min read)
```bash
cd task-1-docker-commands
# Read DOCKER_COMMANDS.md for all available commands
```

### Task 2: Build and Run First Container (10 min)
```bash
cd task-2-dockerfile-container
docker build -t curiousgaurav-app:1.0 .
docker run -d -p 3000:3000 --name my-app curiousgaurav-app:1.0
curl http://localhost:3000/health
# ✓ Running!
docker stop my-app && docker rm my-app
```

### Task 3: Expose Container on Multiple Ports (10 min)
```bash
cd task-3-expose-container
docker build -t curiousgaurav-exposed-app:1.0 .
docker run -d -p 8080:8080 --name exposed-app curiousgaurav-exposed-app:1.0
curl http://localhost:8080/status
# ✓ Exposed!
docker stop exposed-app && docker rm exposed-app
```

## 📋 Command Reference

### Build Images
```bash
docker build -t image-name:tag .
```

### Run Containers
```bash
# Basic
docker run -d --name container-name image-name:tag

# With port mapping
docker run -d -p host-port:container-port --name container-name image-name:tag

# Interactive
docker run -it image-name:tag /bin/bash
```

### Monitor
```bash
# View logs
docker logs -f container-name

# List containers
docker ps -a

# List images
docker images

# Resource usage
docker stats container-name
```

### Cleanup
```bash
# Stop container
docker stop container-name

# Remove container
docker rm container-name

# Remove image
docker rmi image-name:tag
```

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Port already used | Use different port: `docker run -d -p 8081:8080 ...` |
| Container exits | Check logs: `docker logs container-name` |
| Cannot access app | Verify: `docker ps` and `curl http://localhost:port` |
| Permission denied | Linux: `sudo usermod -aG docker $USER` |

## 📚 Documentation Files

- [Docker Commands Guide](./task-1-docker-commands/DOCKER_COMMANDS.md)
- [Task 2: Dockerfile Details](./task-2-dockerfile-container/README.md)
- [Task 3: Port Configuration](./task-3-expose-container/PORT_CONFIGURATION.md)
- [Full Installation Guide](./INSTALLATION.md)
- [Main README](./README.md)

## ✅ Success Indicators

- ✓ Task 1: Understand Docker commands
- ✓ Task 2: Built image appears in `docker images`
- ✓ Task 3: Container runs and responds to `curl`

## 🎯 Next Steps

1. Modify Node.js code and rebuild containers
2. Push images to Docker Hub
3. Explore Docker volumes and networks
4. Try Docker Compose for multi-container apps

---

**Need help?** Check INSTALLATION.md for troubleshooting
