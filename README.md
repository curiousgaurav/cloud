# Cloud Lab - Docker Tasks

This repository contains three Docker learning tasks designed to familiarize you with containerization concepts.

## Project Structure

```
cloud-lab/
├── task-1-docker-commands/
│   └── DOCKER_COMMANDS.md
├── task-2-dockerfile-container/
│   ├── Dockerfile
│   ├── server.js
│   └── package.json
├── task-3-expose-container/
│   ├── Dockerfile
│   ├── app.js
│   ├── package.json
│   └── PORT_CONFIGURATION.md
└── README.md
```

## Tasks Overview

### Task 1: Explore Docker Containers
Learn and practice popular Docker commands for managing containers.

### Task 2: Create a Docker Container using Dockerfile
Build a custom Docker container with your name and basic functionality.

### Task 3: Expose a Docker Container
Host a Node.js application and expose it through port mapping.

## Quick Start

### Prerequisites
- Docker installed on your system
- Node.js 14+ (for local development)
- Basic command-line knowledge

### Installation

1. **Install Docker** (if not already installed):
   - Windows: [Download Docker Desktop](https://www.docker.com/products/docker-desktop)
   - Linux: `sudo apt-get install docker.io`
   - macOS: `brew install docker`

2. **Verify Installation**:
   ```bash
   docker --version
   docker run hello-world
   ```

3. **Clone and Navigate**:
   ```bash
   cd cloud-lab
   ```

## Documentation

- [Task 1: Docker Commands Guide](./task-1-docker-commands/DOCKER_COMMANDS.md)
- [Task 2: Dockerfile Instructions](./task-2-dockerfile-container/README.md)
- [Task 3: Port Configuration & Exposure](./task-3-expose-container/PORT_CONFIGURATION.md)

## Author
curiousgaurav

## License
MIT
