# Installation & Setup Guide

Complete guide to set up and run all three Docker tasks.

## Prerequisites

### Windows
1. **Docker Desktop**
   - Download: https://www.docker.com/products/docker-desktop
   - System Requirements: Windows 10/11 Pro, Enterprise, or Education (with WSL 2)
   - Installation: Run installer and follow prompts
   - Verify: `docker --version`

2. **PowerShell or Command Prompt**
   - Already included with Windows

3. **Optional: Git**
   - Download: https://git-scm.com/
   - For cloning repositories and version control

### macOS
```bash
# Install Docker Desktop
brew install docker

# Or download from: https://www.docker.com/products/docker-desktop
```

### Linux (Ubuntu/Debian)
```bash
# Install Docker
sudo apt-get update
sudo apt-get install docker.io

# Add user to docker group (avoid sudo)
sudo usermod -aG docker $USER
newgrp docker

# Verify
docker --version
```

## Step-by-Step Installation

### 1. Install Docker

#### Windows
- Download Docker Desktop from https://www.docker.com/products/docker-desktop
- Run the installer
- Allow it to modify your system
- Restart your computer
- Open PowerShell and verify:
  ```powershell
  docker --version
  docker run hello-world
  ```

#### macOS
```bash
brew install --cask docker
# Or use native installer from https://www.docker.com/products/docker-desktop

# Verify
docker --version
docker run hello-world
```

#### Linux
```bash
sudo apt-get update
sudo apt-get install docker.io
sudo systemctl start docker
sudo usermod -aG docker $USER

# Verify
docker --version
docker run hello-world
```

### 2. Clone or Download the Repository

#### Option A: Using Git (Recommended)
```bash
git clone https://github.com/curiousgaurav/cloud.git
cd cloud
```

#### Option B: Direct Download
- Download the folder as ZIP
- Extract to desired location

### 3. Verify Installation Structure

Ensure the folder structure matches:
```
cloud/
├── README.md
├── INSTALLATION.md
├── task-1-docker-commands/
│   └── DOCKER_COMMANDS.md
├── task-2-dockerfile-container/
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js
│   └── README.md
└── task-3-expose-container/
    ├── Dockerfile
    ├── package.json
    ├── app.js
    └── PORT_CONFIGURATION.md
```

## Running Each Task

### Task 1: Docker Commands (No Setup Required)
Simply read the DOCKER_COMMANDS.md file for comprehensive guide:
```bash
cd task-1-docker-commands
cat DOCKER_COMMANDS.md  # macOS/Linux
type DOCKER_COMMANDS.md  # Windows
```

Then practice commands:
```bash
# Example commands
docker pull ubuntu
docker run -it ubuntu /bin/bash
docker images
docker ps -a
```

### Task 2: Create Dockerfile Container

#### Setup
```bash
cd task-2-dockerfile-container

# Build the Docker image
docker build -t curiousgaurav-app:1.0 .
```

#### Run
```bash
# Run the container with port mapping
docker run -d -p 3000:3000 --name my-app curiousgaurav-app:1.0
```

#### Test
```bash
# Test the application
curl http://localhost:3000/
curl http://localhost:3000/health
curl http://localhost:3000/api/info
```

Or open in browser: http://localhost:3000/

#### Stop and Cleanup
```bash
docker stop my-app
docker rm my-app
```

### Task 3: Expose Container with Port Mapping

#### Setup
```bash
cd task-3-expose-container

# Build the image
docker build -t curiousgaurav-exposed-app:1.0 .
```

#### Run with Port Mapping
```bash
# Option 1: Single port
docker run -d -p 8080:8080 --name exposed-app curiousgaurav-exposed-app:1.0

# Option 2: Multiple ports
docker run -d \
  -p 8080:8080 \
  -p 3000:8080 \
  -p 5000:8080 \
  --name exposed-app \
  curiousgaurav-exposed-app:1.0
```

#### Test
```bash
# Test endpoints
curl http://localhost:8080/
curl http://localhost:8080/health
curl http://localhost:8080/status
curl http://localhost:8080/api/info

# Or multiple ports
curl http://localhost:3000/
curl http://localhost:5000/
```

#### Monitor
```bash
# View logs in real-time
docker logs -f exposed-app

# Check container stats
docker stats exposed-app
```

#### Cleanup
```bash
docker stop exposed-app
docker rm exposed-app
```

## Verifying Installation

### Check Docker Installation
```bash
# Version information
docker --version

# Detailed system information
docker info

# List images
docker images

# List running containers
docker ps
```

### First Run Test
```bash
# Test with hello-world image
docker run hello-world

# Expected output includes: "Hello from Docker!"
```

### Test Node.js Container
```bash
# Run Node.js container
docker run -it node:14-alpine node -e "console.log('Node.js in Docker works!')"

# Expected: "Node.js in Docker works!"
```

## System Requirements Verification

### Minimum Requirements
| Component | Minimum | Recommended |
|-----------|---------|-------------|
| CPU | 2 cores | 4+ cores |
| RAM | 2 GB | 4+ GB |
| Disk Space | 5 GB | 20+ GB |
| OS | Windows 10/Linux | Windows 11/macOS/Linux |

### Check Your System
```bash
# Windows: Check system info
wmic os get caption, osarchitecture
wmic cpu get name, cores
wmic os get totalvisiblememorytokens  # Divide by 1048576 for GB

# macOS/Linux
uname -a
sysctl -n hw.cpucore
free -h  # Linux
vm_stat | perl -ne '/page size/ and $size=$1; /Pages free:/ and printf("%.1f MB\n", $1 * $size / 1048576);'  # macOS
```

## Troubleshooting Installation

### Issue: Docker Daemon Not Running

**Windows**
```
Open Docker Desktop from Start menu
Wait 2-3 minutes for it to start
Verify in system tray
```

**macOS/Linux**
```bash
# Start Docker
sudo systemctl start docker  # Linux

# Verify
docker ps
```

### Issue: Docker Command Not Found

**Windows**
- Verify Docker is installed: `C:\Program Files\Docker\Docker\Docker.exe`
- Restart PowerShell or Command Prompt
- Add to PATH if needed

**macOS**
```bash
# Install via Homebrew
brew install --cask docker

# Or verify existing installation
which docker
```

**Linux**
```bash
sudo apt-get update
sudo apt-get install docker.io
```

### Issue: Permission Denied

**Linux**
```bash
# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Then run docker commands without sudo
docker ps
```

### Issue: Port Already in Use

```bash
# Find what's using the port
# Windows
netstat -ano | findstr :8080

# macOS/Linux
lsof -i :8080

# Use different port
docker run -d -p 8081:8080 --name my-app image:tag
```

## Environment Setup

### Windows PowerShell

```powershell
# Check Docker
docker --version

# Navigate to project
cd C:\Users\<your-username>\Desktop\lab

# Run tasks
cd task-2-dockerfile-container
docker build -t curiousgaurav-app:1.0 .
```

### macOS/Linux Bash

```bash
# Navigate to project
cd ~/Desktop/lab

# Or if cloned from git
cd ~/path/to/cloud

# Run tasks
cd task-2-dockerfile-container
docker build -t curiousgaurav-app:1.0 .
```

### Set Environment Variables (Optional)

**Windows PowerShell**
```powershell
$env:DOCKER_CONTENT_TRUST=1
echo $env:DOCKER_CONTENT_TRUST
```

**macOS/Linux Bash**
```bash
export DOCKER_CONTENT_TRUST=1
echo $DOCKER_CONTENT_TRUST
```

## Quick Start

### Fast Track (Assumes Docker is Installed)

```bash
# 1. Navigate to project
cd cloud-lab

# 2. Task 2: Build and run
cd task-2-dockerfile-container
docker build -t curiousgaurav-app:1.0 .
docker run -d -p 3000:3000 --name my-app curiousgaurav-app:1.0

# 3. Test in browser or terminal
curl http://localhost:3000/health

# 4. Task 3: Build and run
cd ../task-3-expose-container
docker build -t curiousgaurav-exposed-app:1.0 .
docker run -d -p 8080:8080 --name exposed-app curiousgaurav-exposed-app:1.0

# 5. Test
curl http://localhost:8080/status
```

## Cleanup After Tasks

### Remove Everything

```bash
# Stop all containers
docker stop $(docker ps -q) 2>/dev/null

# Remove all containers
docker rm $(docker ps -aq) 2>/dev/null

# Remove images built for this project
docker rmi curiousgaurav-app:1.0
docker rmi curiousgaurav-exposed-app:1.0

# Clean up Docker system
docker system prune -a
```

## Additional Resources

### Official Documentation
- Docker: https://docs.docker.com/
- Docker CLI Reference: https://docs.docker.com/engine/reference/commandline/
- Node.js Docker Image: https://hub.docker.com/_/node

### Learning Resources
- Docker Getting Started: https://docs.docker.com/get-started/
- Docker Tutorial: https://www.docker.com/101-tutorial
- Play with Docker: https://www.docker.com/play-with-docker

### Community Help
- Docker Community Slack: https://dockr.ly/comm-slack
- Stack Overflow: Tag your questions with `docker`
- GitHub Issues: Check project repositories

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the individual task README files
3. Check Docker logs: `docker logs <container-name>`
4. Verify system requirements
5. Ensure Docker daemon is running

## Next Steps

After completing installation:

1. **Task 1**: Read and practice Docker commands
2. **Task 2**: Build your first Dockerfile container
3. **Task 3**: Learn port mapping and exposure
4. **Extension**: Modify the Node.js applications and rebuild
5. **Advanced**: Push images to Docker Hub (requires account)

---

**Created for**: Cloud Lab Learning
**Author**: curiousgaurav
**Last Updated**: April 2026
