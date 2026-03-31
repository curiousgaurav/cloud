# Cloud Lab - Docker & Kubernetes Tasks

This repository contains comprehensive learning tasks for container and Kubernetes technologies.

## Project Structure

```
cloud-lab/
├── docker-tasks/                              (Docker fundamentals)
│   ├── task-1-docker-commands/
│   │   └── DOCKER_COMMANDS.md
│   ├── task-2-dockerfile-container/
│   │   ├── Dockerfile
│   │   ├── server.js
│   │   └── package.json
│   └── task-3-expose-container/
│       ├── Dockerfile
│       ├── app.js
│       └── PORT_CONFIGURATION.md
│
└── minikube-tasks/                           (Kubernetes orchestration)
    ├── COMPLETE_SETUP_GUIDE.md              ← Start here!
    ├── QUICK_REFERENCE.md
    ├── task-1-minikube-setup/
    │   ├── MINIKUBE_INSTALLATION.md
    │   └── MINIKUBE_COMMANDS.md
    ├── task-2-kubernetes-deployment/
    │   ├── deployment.yaml
    │   ├── deployment-explained.md
    │   └── DEPLOYMENT_COMMANDS.md
    └── task-3-ml-service/
        ├── ml_app.py
        ├── Dockerfile
        ├── ml-service-deployment.yaml
        └── ML_SERVICE_GUIDE.md
```

## Learning Path

### Module 1: Docker Fundamentals (Tasks 1-3)
Learn containerization with Docker, building and exposing containers.

**Tasks:**
- Task 1: Explore Docker Commands
- Task 2: Create Custom Docker Container
- Task 3: Expose Container with Port Mapping

[👉 Go to Docker Tasks](./task-1-docker-commands/../../../)

### Module 2: Kubernetes Orchestration (Tasks 1-3)
Master Kubernetes deployments, services, and ML microservices.

**Tasks:**
- Task 1: Install & Explore Minikube + Dashboard
- Task 2: Deploy Application & Verify Pod Status
- Task 3: Deploy ML-as-a-Service & Make Predictions

[👉 Read: Complete Minikube Setup Guide](./minikube-tasks/COMPLETE_SETUP_GUIDE.md)

- [Docker Tasks README](./QUICK_START.md) - Docker track overview
- [Docker Commands](./task-1-docker-commands/DOCKER_COMMANDS.md)
- [Kubernetes Complete Guide](./minikube-tasks/COMPLETE_SETUP_GUIDE.md) - Kubernetes track
- [Kubernetes Quick Reference](./minikube-tasks/QUICK_REFERENCE.md)
- [Installation Guide](./INSTALLATION.md) - System setup

## Key Concepts

### Docker
- **Image**: Blueprint for containers
- **Container**: Running instance of image
- **Dockerfile**: Recipe to build image
- **Port Mapping**: Map host port to container port
- **Volumes**: Persistent storage for containers

### Kubernetes (K8s)
- **Pod**: Smallest deployable unit (wraps container)
- **Deployment**: Manages pods with replicas
- **Service**: Stable network interface for pods
- **YAML**: Infrastructure as Code
- **Minikube**: Local Kubernetes cluster

### ML-as-a-Service
- **REST API**: HTTP endpoints for predictions
- **Containerization**: ML model in container
- **Service Exposure**: Public access to model
- **Batch Processing**: Multiple predictions
- **Health Checks**: Automatic pod restart

## Learning Outcomes

By completing all tasks, you'll understand:
- ✅ Container fundamentals and best practices
- ✅ Kubernetes architecture and deployments
- ✅ YAML manifests and configurations
- ✅ Service exposure and networking
- ✅ Pod lifecycle and health management
- ✅ Horizontal scaling
- ✅ ML model deployment
- ✅ Microservice architecture

## Command Reference

### Docker
```bash
docker build -t name:tag .
docker run -d -p host:container name:tag
docker logs <container>
docker exec -it <container> /bin/bash
```

### Kubernetes
```bash
kubectl apply -f file.yaml
kubectl get pods
kubectl describe pod <name>
kubectl logs <pod>
kubectl port-forward svc/<svc> 8080:80
```

### Minikube
```bash
minikube start --driver=docker
minikube dashboard
minikube stop
minikube delete
```

## Troubleshooting

See [INSTALLATION.md](./INSTALLATION.md) for detailed troubleshooting guide.

## Resources

- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Minikube Guide](https://minikube.sigs.k8s.io/)
- [YAML Syntax](https://yaml.org/)

## Author
@curiousgaurav

## License
MIT

---

## Getting Started

**Beginners**: Start with [Minikube Complete Setup Guide](./minikube-tasks/COMPLETE_SETUP_GUIDE.md)  
**Quick Reference**: See [Quick Reference Guide](./minikube-tasks/QUICK_REFERENCE.md)  
**Troubleshooting**: Check [Installation Guide](./INSTALLATION.md)

Happy Learning! 🐳 ☸️ 🚀
