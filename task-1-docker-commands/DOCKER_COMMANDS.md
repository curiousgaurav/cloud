# Task 1: Docker Commands Guide

## Objective
Explore and practice popular Docker commands to familiarize yourself with container management.

## Common Docker Commands

### 1. Check Docker Version and Info
```bash
# Check Docker version
docker --version

# Get detailed Docker system information
docker info
```

### 2. Image Management

#### List Images
```bash
# List all images on your system
docker images

# List image IDs only
docker images -q

# Show detailed image information
docker images --no-trunc
```

#### Pull Images
```bash
# Pull an image from Docker Hub
docker pull ubuntu

# Pull a specific version (tag)
docker pull node:14-alpine

# List: ubuntu, python, nginx, node, alpine
```

#### Remove Images
```bash
# Remove an image
docker rmi ubuntu

# Force remove an image
docker rmi -f image_id

# Remove dangling (unused) images
docker image prune
```

### 3. Container Management

#### Run Containers
```bash
# Run a container interactively
docker run -it ubuntu /bin/bash

# Run a container in detached mode (background)
docker run -d ubuntu

# Run with custom name
docker run --name my-container ubuntu

# Run with port mapping
docker run -p 8080:80 nginx

# Run and remove container after exit
docker run --rm ubuntu
```

#### List Containers
```bash
# List running containers
docker ps

# List all containers (running and stopped)
docker ps -a

# Show only container IDs
docker ps -q

# Show all container information
docker ps -a --no-trunc
```

#### Container Operations
```bash
# Start a stopped container
docker start container_name

# Stop a running container
docker stop container_name

# Force stop a container
docker kill container_name

# Restart a container
docker restart container_name

# Remove a container
docker rm container_name

# Remove all stopped containers
docker container prune
```

### 4. View Container Details

#### Logs
```bash
# View container logs
docker logs container_name

# Follow logs in real-time
docker logs -f container_name

# Show last 50 lines
docker logs --tail 50 container_name

# Show logs with timestamps
docker logs -t container_name
```

#### Inspect
```bash
# Get detailed container information
docker inspect container_name

# Get specific information (IP address)
docker inspect -f '{{.NetworkSettings.IPAddress}}' container_name
```

#### Execute Commands
```bash
# Run a command in a running container
docker exec -it container_name /bin/bash

# Execute without entering shell
docker exec container_name ls /
```

### 5. System Cleanup

```bash
# Remove all unused containers
docker container prune

# Remove all unused images
docker image prune

# Remove all unused volumes
docker volume prune

# Remove all unused networks
docker network prune

# Remove everything (containers, images, volumes, networks)
docker system prune -a
```

## Common Workflows

### Workflow 1: Run and Interact with Ubuntu
```bash
docker run -it --name test-ubuntu ubuntu /bin/bash
# Inside container:
apt-get update
apt-get install -y curl
curl https://www.google.com
exit

# Container is now stopped, restart it
docker start test-ubuntu
docker exec -it test-ubuntu /bin/bash
```

### Workflow 2: Run Nginx Web Server
```bash
# Run Nginx container
docker run -d --name my-nginx -p 8080:80 nginx

# Access at http://localhost:8080
# View logs
docker logs my-nginx

# Enter container
docker exec -it my-nginx /bin/bash

# Stop and remove
docker stop my-nginx
docker rm my-nginx
```

### Workflow 3: Check Container Processes
```bash
# See what's running in a container
docker top container_name

# Get resource usage statistics
docker stats container_name
```

## Practice Exercises

1. **Pull and Run Ubuntu**
   ```bash
   docker pull ubuntu
   docker run -it ubuntu /bin/bash
   ```

2. **Run Nginx and Access It**
   ```bash
   docker run -d -p 8080:80 nginx
   # Open http://localhost:8080 in browser
   ```

3. **Inspect Running Container**
   ```bash
   docker inspect <container_id>
   ```

4. **View Container Logs**
   ```bash
   docker logs <container_id>
   ```

5. **Execute Command in Container**
   ```bash
   docker exec <container_id> pwd
   ```

6. **Stop and Remove Containers**
   ```bash
   docker stop <container_id>
   docker rm <container_id>
   ```

## Tips and Best Practices

- Always name your containers for easy reference: `docker run --name my-app ...`
- Use tags to version your images: `docker tag image:version`
- Keep container logs for debugging: Use `docker logs`
- Remove unused containers and images regularly to save space
- Use `-it` flags when you need interactive terminal access
- Use `-d` flag to run containers in background
- Always stop containers before removing them: `docker stop` then `docker rm`

## Important Notes

- A container is a lightweight, standalone, executable package
- Images are blueprints; containers are instances
- Containers are isolated from each other and from the host
- Port mapping syntax: `-p host_port:container_port`
- Default Docker Hub registry is used if no registry is specified
