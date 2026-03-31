# Task 1: Minikube Installation & Setup

## Objective
Install Minikube, start a local Kubernetes cluster using Docker driver, and explore the Kubernetes Dashboard.

## What is Minikube?

Minikube is:
- A lightweight Kubernetes distribution
- Runs on your local machine (not cloud)
- Single-node cluster for development/testing
- Free and open-source
- Supported on Windows, macOS, and Linux

## System Requirements

### Windows
- Windows 10/11 Pro, Enterprise, or Education
- Minimum 2 CPU cores
- Minimum 2 GB RAM (4GB recommended)
- 10 GB free disk space
- Docker Desktop installed
- Administrator privileges

### macOS
- macOS 10.12+
- 2 CPU cores minimum
- 2 GB RAM minimum (4GB recommended)
- 10 GB free disk space
- Docker installed
- Virtualization support enabled

### Linux
- Ubuntu 18.04+, Fedora, Debian, or CentOS
- 2 CPU cores
- 2 GB RAM (4GB recommended)
- 10 GB disk space
- Docker installed
- Virtualization enabled

## Installation

### Windows Installation

#### Step 1: Check Prerequisites
```powershell
# Verify Docker is installed
docker --version

# Check system resources
wmic os get caption
wmic cpu get numberofcores
```

#### Step 2: Download Minikube

**Option A: Using Chocolatey (Recommended)**
```powershell
# Install Chocolatey if not already installed (run as Administrator)
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install Minikube
choco install minikube -y

# Verify installation
minikube version
```

**Option B: Direct Download**
```powershell
# Download and install
cd $env:USERPROFILE\Downloads
curl.exe -Lo minikube.exe https://github.com/kubernetes/minikube/releases/latest/download/minikube-windows-amd64.exe

# Move to Program Files
Move-Item .\minikube.exe 'C:\Program Files\minikube.exe'

# Add to PATH
$env:Path += ';C:\Program Files'

# Verify
minikube version
```

**Option C: Using Windows Package Manager**
```powershell
winget install Kubernetes.minikube
```

#### Step 3: Install kubectl (Kubernetes CLI)
```powershell
# Minikube includes kubectl, but you can also install separately
choco install kubernetes-cli -y

# Verify
kubectl version --client
```

### macOS Installation

```bash
# Using Homebrew (Recommended)
brew install minikube

# Using direct download
curl -LO https://github.com/kubernetes/minikube/releases/latest/download/minikube-darwin-amd64
sudo install minikube-darwin-amd64 /usr/local/bin/minikube

# Install kubectl
brew install kubectl

# Verify
minikube version
kubectl version --client
```

### Linux Installation (Ubuntu/Debian)

```bash
# Download Minikube
curl -LO https://github.com/kubernetes/minikube/releases/latest/download/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Install kubectl
sudo apt-get update
sudo apt-get install -y kubectl

# Verify
minikube version
kubectl version --client
```

## Starting Minikube

### Step 1: Start with Docker Driver

```bash
# Basic start (uses VM driver by default)
minikube start --driver=docker

# Full command with all options
minikube start \
  --driver=docker \
  --cpus=2 \
  --memory=4096 \
  --disk-size=20g \
  --kubernetes-version=latest

# Check status
minikube status

# Expected output:
# minikube: Running
# kubelet: Running
# apiserver: Running
# kubeconfig: Configured
```

### Step 2: Verify Kubernetes Cluster

```bash
# Check cluster info
kubectl cluster-info

# Get nodes
kubectl get nodes

# Expected output:
# NAME       STATUS   ROLES                  AGE    VERSION
# minikube   Ready    control-plane,master   2m     v1.xx.x
```

### Step 3: Verify Docker Integration

```bash
# Points kubectl to Minikube's Docker daemon
eval $(minikube docker-env)

# Or in PowerShell:
minikube docker-env | Invoke-Expression

# Verify - images built in Minikube can be used directly
docker images
```

## Accessing Kubernetes Dashboard

### Start Dashboard

```bash
# Option 1: Automatic browser launch
minikube dashboard

# Option 2: Get dashboard URL only
minikube dashboard --url

# Example output: http://127.0.0.1:38789/api/v1/namespaces/kubernetes-dashboard/services/http:kubernetes-dashboard:/proxy/
```

### Dashboard Features

The Kubernetes Dashboard provides:
- Cluster overview
- Workload management (Pods, Deployments, StatefulSets)
- Service and Load Balancer inspection
- Namespace management
- Resource monitoring
- Log viewing
- Application deployment interface

### Dashboard Exploration

1. **Cluster Overview Page**
   - Shows all nodes and resources
   - Real-time resource usage (CPU, memory)
   - Node health status

2. **Workloads Section**
   - View running pods
   - Check deployment status
   - Monitor replica sets
   - View pod logs and details

3. **Services & Load Balancers**
   - List all services
   - Check service endpoints
   - Monitor traffic

4. **ConfigMaps & Secrets**
   - View configuration data
   - Manage secrets

## Common Minikube Commands

### Cluster Management

```bash
# Start cluster
minikube start --driver=docker

# Stop cluster (doesn't delete)
minikube stop

# Delete cluster
minikube delete

# Pause cluster
minikube pause

# Unpause cluster
minikube unpause

# Status
minikube status

# Get cluster info
kubectl cluster-info
```

### Access & Configuration

```bash
# Start dashboard
minikube dashboard

# SSH into Minikube
minikube ssh

# Docker environment for building images in Minikube
minikube docker-env

# Configure docker to use Minikube's daemon
eval $(minikube docker-env)

# Access Kubernetes API
kubectl api-resources

# Get kubeconfig path
kubectl config current-context
```

### Resource Management

```bash
# Allocate more CPU (2 cores)
minikube config set cpus 2

# Allocate more memory (4GB)
minikube config set memory 4096

# Allocate more disk space
minikube config set disk-size 20g

# Check Minikube config
minikube config view
```

### Building & Pushing Images

```bash
# Configure shell to use Minikube Docker daemon
eval $(minikube docker-env)

# Build image in Minikube
docker build -t my-app:1.0 .

# Image is now available in Minikube
kubectl run test --image=my-app:1.0

# Without configuring docker-env, you'd need to:
docker build -t myregistry/my-app:1.0 .
docker push myregistry/my-app:1.0
kubectl run test --image=myregistry/my-app:1.0
```

### Add-ons & Features

```bash
# List available add-ons
minikube addons list

# Enable add-on (example: metrics-server)
minikube addons enable metrics-server

# Enable dashboard
minikube addons enable dashboard

# Disable add-on
minikube addons disable metrics-server

# Enable registry add-on
minikube addons enable registry
```

### Troubleshooting

```bash
# Get logs
minikube logs

# Get detailed status
minikube status --output=json

# Get Minikube profile details
minikube profile list

# Profile management
minikube profile start

# Check supported Kubernetes versions
minikube start --help | grep kubernetes-version

# Clean up completely
minikube delete --all
```

## Verification Checklist

- [ ] Docker is installed and running
- [ ] Minikube installed: `minikube version`
- [ ] kubectl installed: `kubectl version --client`
- [ ] Minikube started: `minikube start --driver=docker`
- [ ] Cluster ready: `kubectl get nodes` shows Ready status
- [ ] Dashboard accessible: `minikube dashboard` opens browser
- [ ] Can access pods: `kubectl get pods --all-namespaces`

## Troubleshooting

### Issue: "minikube: command not found"

**Windows:**
```powershell
# Reinstall via Chocolatey
choco install minikube -y --force

# Or add to PATH manually
$PATH += "C:\Program Files"
[Environment]::SetEnvironmentVariable("Path", $PATH, "User")
```

**macOS/Linux:**
```bash
# Check if Minikube is in PATH
which minikube

# If not found, reinstall
brew install minikube  # macOS
```

### Issue: "Docker daemon is not running"

```bash
# Start Docker Desktop (Windows/macOS)
# Or start Docker daemon (Linux)
sudo systemctl start docker

# Then start Minikube
minikube start --driver=docker
```

### Issue: "Insufficient resources"

```bash
# Allocate more resources
minikube config set memory 4096
minikube config set cpus 2
minikube delete
minikube start --driver=docker
```

### Issue: "Cannot connect to cluster"

```bash
# Check cluster status
minikube status

# Reset kubeconfig
kubectl config use-context minikube

# Or restart Minikube
minikube stop
minikube start --driver=docker
```

## Next Steps

After successful installation:

1. Proceed to **Task 2**: Deploy applications on Minikube
2. Explore Kubernetes Dashboard for 5 minutes
3. Try basic kubectl commands:
   ```bash
   kubectl get pods
   kubectl get nodes
   kubectl get deployments
   ```
4. Ready to deploy: `cd ../task-2-kubernetes-deployment`

## Quick Start One-Liner

```bash
# Complete setup (Windows PowerShell as Administrator)
choco install minikube kubernetes-cli -y; `
minikube start --driver=docker --cpus=2 --memory=4096; `
minikube status; `
minikube dashboard

# Linux/macOS
brew install minikube kubectl && \
minikube start --driver=docker --cpus=2 --memory=4096 && \
minikube status && \
minikube dashboard &
```

## Important Notes

- **First start takes 2-5 minutes**: Building VM/container, downloading Kubernetes components
- **Minikube stops clusters on idle**: Automatically stops to save resources
- **Kubeconfig is auto-configured**: kubectl automatically points to Minikube
- **Recreate clusters**: Can start/stop without data loss (unless deleted)
- **Resource intensive**: Monitor CPU/memory usage during operation

---

**Next**: Read [MINIKUBE_COMMANDS.md](./MINIKUBE_COMMANDS.md) for comprehensive command reference.
