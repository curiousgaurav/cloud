# Minikube & Kubernetes Lab

Learn Kubernetes containerization using Minikube - the lightweight local Kubernetes cluster.

## Project Structure

```
minikube-tasks/
├── task-1-minikube-setup/
│   ├── MINIKUBE_INSTALLATION.md
│   └── MINIKUBE_COMMANDS.md
├── task-2-kubernetes-deployment/
│   ├── deployment.yaml
│   ├── deployment-explained.md
│   ├── DEPLOYMENT_COMMANDS.md
│   └── nginx-app/
│       ├── Dockerfile
│       └── index.html
└── task-3-ml-service/
    ├── ml-service-deployment.yaml
    ├── ml-service.yaml
    ├── ML_SERVICE_GUIDE.md
    ├── ml_app.py
    ├── requirements.txt
    ├── Dockerfile
    └── test-predictions.sh
```

## Tasks Overview

### Task 1: Install & Explore Minikube
- Installation for Windows/macOS/Linux
- Start Minikube cluster with Docker driver
- Access Kubernetes Dashboard
- Learn basic Minikube commands

### Task 2: Kubernetes Deployment
- Deploy container application on Minikube
- Understand Kubernetes YAML structure
- Verify pod status using kubectl commands
- Explore deployment configurations

### Task 3: ML-as-a-Service
- Build machine learning microservice
- YAML-based service deployment
- Port forwarding and service exposure
- Test predictions with HTTP requests

## Quick Start

### 1. Install Minikube
```bash
# Follow MINIKUBE_INSTALLATION.md for your OS
cd task-1-minikube-setup
```

### 2. Start Minikube
```bash
minikube start --driver=docker
minikube dashboard
```

### 3. Deploy Application
```bash
cd ../task-2-kubernetes-deployment
kubectl apply -f deployment.yaml
kubectl get pods
```

### 4. Deploy ML Service
```bash
cd ../task-3-ml-service
kubectl apply -f ml-service-deployment.yaml
kubectl apply -f ml-service.yaml
kubectl port-forward svc/ml-service 5000:5000
```

## System Requirements

| Component | Requirement |
|-----------|------------|
| CPU | 2+ cores |
| RAM | 2+ GB (4GB recommended) |
| Disk | 10+ GB free space |
| Docker | Already installed |
| Virtualization | Enabled (for VM driver) |

## Documentation Files

### Getting Started
- [COMPLETE SETUP GUIDE](./COMPLETE_SETUP_GUIDE.md) - Start here! Full overview and workflow
- [QUICK REFERENCE](./QUICK_REFERENCE.md) - Command cheat sheet and quick lookup

### Task 1: Minikube Setup
- [Minikube Installation](./task-1-minikube-setup/MINIKUBE_INSTALLATION.md) - Detailed setup guide
- [Minikube Commands](./task-1-minikube-setup/MINIKUBE_COMMANDS.md) - All minikube & kubectl commands

### Task 2: Kubernetes Deployment
- [Deployment YAML Explained](./task-2-kubernetes-deployment/deployment-explained.md) - Line-by-line explanation
- [Deployment Commands](./task-2-kubernetes-deployment/DEPLOYMENT_COMMANDS.md) - kubectl command guide
- [deployment.yaml](./task-2-kubernetes-deployment/deployment.yaml) - Ready-to-use YAML file

### Task 3: ML-as-a-Service
- [ML Service Guide](./task-3-ml-service/ML_SERVICE_GUIDE.md) - Complete ML deployment guide
- [ml_app.py](./task-3-ml-service/ml_app.py) - Flask ML service with 8+ endpoints
- [Dockerfile](./task-3-ml-service/Dockerfile) - Container definition
- [test-predictions.sh](./task-3-ml-service/test-predictions.sh) - Automated test script

## Key Concepts

### Minikube
- Local Kubernetes cluster for development
- Runs single-node cluster on your machine
- Simulates multi-node production environment
- Supports multiple hypervisors/drivers

### Kubernetes Objects
- **Pod**: Smallest deployable unit (wraps container)
- **Deployment**: Manages replica sets and updates
- **Service**: Network abstraction for pod access
- **StatefulSet**: For stateful applications
- **ConfigMap**: Configuration data storage

### YAML Structure
```yaml
apiVersion: apps/v1               # Kubernetes API version
kind: Deployment                  # Kubernetes object type
metadata:                         # Object metadata
  name: app-deployment
spec:                             # Object specification
  replicas: 3                     # Number of pod copies
  selector:                       # How to find pods
    matchLabels:
      app: my-app
  template:                       # Pod template
    metadata:
      labels:
        app: my-app
    spec:                         # Pod specification
      containers:
      - name: app
        image: my-image:1.0
        ports:
        - containerPort: 8080
```

## Common Workflows

### Deploy Application
```bash
kubectl apply -f deployment.yaml
kubectl get deployments
kubectl get pods
```

### Check Pod Status
```bash
kubectl describe pod <pod-name>
kubectl logs <pod-name>
kubectl exec -it <pod-name> -- /bin/bash
```

### Scale Deployment
```bash
kubectl scale deployment my-app --replicas=5
```

### Update Image
```bash
kubectl set image deployment/my-app app=my-image:2.0
```

### Expose Service
```bash
kubectl expose deployment my-app --type=LoadBalancer --port=8080
kubectl port-forward svc/my-app 8080:8080
```

## Author
curiousgaurav

## License
MIT
