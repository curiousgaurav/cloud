# Complete Minikube & Kubernetes Lab Setup Guide

## Overview

This comprehensive guide covers three progressive Minikube tasks:
1. **Installation & Dashboard Exploration** - Set up local Kubernetes
2. **Kubernetes Deployment** - Deploy containerized web app
3. **ML-as-a-Service** - Deploy machine learning microservice

## 📋 Project Structure

```
minikube-tasks/
├── README.md                                    ← Start here
├── QUICK_REFERENCE.md                         ← Command cheat sheet
├── task-1-minikube-setup/
│   ├── MINIKUBE_INSTALLATION.md               ← Installation guide
│   └── MINIKUBE_COMMANDS.md                   ← Commands reference
├── task-2-kubernetes-deployment/
│   ├── deployment.yaml                        ← Deployment + Service
│   ├── deployment-explained.md                ← YAML explanation
│   ├── DEPLOYMENT_COMMANDS.md                 ← kubectl commands
│   └── nginx-app/
│       ├── Dockerfile
│       └── index.html
└── task-3-ml-service/
    ├── ml_app.py                              ← ML Flask app
    ├── Dockerfile                             ← Container image
    ├── requirements.txt                       ← Python dependencies
    ├── ml-service-deployment.yaml             ← K8s YAML
    ├── ml-service.yaml                        ← Service YAML
    ├── ML_SERVICE_GUIDE.md                    ← Complete guide
    └── test-predictions.sh                    ← Test script
```

## ⚡ Quick Start (One Command Per Task)

### Task 1: Install & Start Minikube
```bash
# Windows PowerShell (as Administrator)
choco install minikube kubernetes-cli -y; `
minikube start --driver=docker --cpus=2 --memory=4096; `
minikube dashboard

# Linux/macOS
brew install minikube kubectl && \
minikube start --driver=docker --cpus=2 --memory=4096 && \
minikube dashboard &
```

### Task 2: Deploy Web Application
```bash
eval $(minikube docker-env)  # Configure Docker
cd task-2-kubernetes-deployment
kubectl apply -f deployment.yaml
kubectl port-forward svc/curiousgaurav-service 8080:80
# In browser: http://localhost:8080
```

### Task 3: Deploy ML Service
```bash
cd ../task-3-ml-service
docker build -t curiousgaurav-ml-service:1.0 .
kubectl apply -f ml-service-deployment.yaml
kubectl port-forward svc/ml-service 5000:5000
# Test: curl -X POST http://localhost:5000/api/predict -H "Content-Type: application/json" -d '{"features": [5.1, 3.5, 1.4, 0.2]}'
```

## 📖 Detailed Guides

### Task 1: Minikube Installation
**Time**: 15 minutes  
**Goal**: Install Minikube, start cluster, explore dashboard

[Read: TASK 1 INSTALLATION GUIDE](./task-1-minikube-setup/MINIKUBE_INSTALLATION.md)

**What you'll learn:**
- Minikube architecture and benefits
- Installation for Windows/macOS/Linux
- Starting cluster with Docker driver
- Kubernetes Dashboard features
- Basic commands (start, stop, delete, status)

**Key Command:**
```bash
minikube start --driver=docker
minikube dashboard
```

### Task 2: Deploy Web Application
**Time**: 20 minutes  
**Goal**: Deploy Nginx app, explore YAML, verify pod status

[Read: TASK 2 DEPLOYMENT GUIDE](./task-2-kubernetes-deployment/DEPLOYMENT_COMMANDS.md)  
[Read: YAML EXPLAINED](./task-2-kubernetes-deployment/deployment-explained.md)

**What you'll learn:**
- YAML Deployment structure (apiVersion, kind, metadata, spec)
- Replicas and pod management
- Service exposure (NodePort, ClusterIP, LoadBalancer)
- Probes (liveness, readiness)
- Resource requests/limits
- Pod status verification commands

**Key Files:**
- `deployment.yaml` - Complete deployment with 3 replicas + service
- `deployment-explained.md` - Line-by-line YAML explanation
- Full Iris-like data structure documentation

**Deployment Commands:**
```bash
kubectl apply -f deployment.yaml        # Deploy
kubectl get pods                        # List pods
kubectl describe deployment <name>      # Details
kubectl logs <pod>                      # Logs
kubectl exec -it <pod> -- /bin/bash    # Enter pod
kubectl port-forward svc/<svc> 8080:80 # Access
```

### Task 3: ML-as-a-Service
**Time**: 30 minutes  
**Goal**: Deploy ML microservice, expose, test predictions

[Read: TASK 3 ML SERVICE GUIDE](./task-3-ml-service/ML_SERVICE_GUIDE.md)

**What you'll learn:**
- Machine Learning in containers
- REST API design for predictions
- Batch processing
- Health checks and readiness
- Service exposure and port forwarding
- Making predictions via HTTP

**ML Service Features:**
- **Model**: Random Forest Classifier (Iris Dataset)
- **Input**: 4 numerical features (flower measurements)
- **Output**: Flower class (Setosa/Versicolor/Virginica) + confidence
- **Endpoints**: 8+ REST API endpoints
- **Replicas**: 2 for load distribution

**Example Predictions:**
```bash
# Small flower (Setosa)
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"features": [5.1, 3.5, 1.4, 0.2]}'
# Response: {"prediction": {"class_name": "setosa", "confidence": 0.99}}

# Medium flower (Versicolor)
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"features": [7.0, 3.2, 4.7, 1.4]}'
# Response: {"prediction": {"class_name": "versicolor", "confidence": 0.98}}

# Large flower (Virginica)
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"features": [6.3, 3.3, 6.0, 2.5]}'
# Response: {"prediction": {"class_name": "virginica", "confidence": 0.97}}
```

## 🎯 Learning Objectives

By completing all three tasks, you'll understand:

### Kubernetes Basics
- ✅ Pod architecture and lifecycle
- ✅ Deployment management and scaling
- ✅ Service discovery and port mapping
- ✅ Health checks (liveness & readiness)
- ✅ Resource allocation (requests & limits)

### Container Orchestration
- ✅ Image building and Minikube Docker integration
- ✅ Rolling updates and zero-downtime deployments
- ✅ Horizontal pod autoscaling (HPA)
- ✅ Namespace management
- ✅ ConfigMap and secrets

### DevOps Skills
- ✅ Infrastructure as Code (YAML)
- ✅ Logging and monitoring
- ✅ Debugging containerized applications
- ✅ Service exposure strategies
- ✅ CI/CD pipeline fundamentals

### ML Deployment
- ✅ ML model containerization
- ✅ REST API design for predictions
- ✅ Batch processing in ML services
- ✅ Model versioning and updates
- ✅ Microservice architecture

## 🔄 Complete Workflow

```
┌─────────────────────────────────┐
│  Task 1: Setup Minikube         │
│  - Install                      │
│  - Start cluster                │
│  - Explore dashboard            │
└──────────────┬──────────────────┘
                ↓
┌─────────────────────────────────┐
│  Task 2: Deploy Application     │
│  - Build Dockerfile             │
│  - Create deployment.yaml       │
│  - Deploy & verify pods         │
│  - Scale & monitor              │
└──────────────┬──────────────────┘
                ↓
┌─────────────────────────────────┐
│  Task 3: ML-as-a-Service        │
│  - Build ML service image       │
│  - Deploy with YAML             │
│  - Expose service               │
│  - Test predictions             │
│  - Scale for load               │
└─────────────────────────────────┘
```

## 📊 Architecture Diagrams

### Task 2: Web Application
```
┌──────────────────────────────────────┐
│         Minikube Cluster             │
├──────────────────────────────────────┤
│  ┌─────────────┐                     │
│  │   Node      │                     │
│  ├─────────────┤                     │
│  │ Pod 1: Nginx│                     │
│  │ Pod 2: Nginx│  ← Replicas: 3     │
│  │ Pod 3: Nginx│                     │
│  └─────────────┘                     │
├──────────────────────────────────────┤
│  Service (NodePort: 30080)           │
│  Routes to: Pod 1, Pod 2, Pod 3      │
└──────────────────────────────────────┘
         ↓ (Port Forward 8080:80)
    http://localhost:8080
```

### Task 3: ML Service
```
┌──────────────────────────────────────┐
│         Minikube Cluster             │
├──────────────────────────────────────┤
│  ┌─────────────────────────┐         │
│  │    ML Service Pod 1     │         │
│  │  Random Forest Model    │  Load   │
│  │  Port 5000              │ Balance │
│  └─────────────────────────┘         │
│  ┌─────────────────────────┐         │
│  │    ML Service Pod 2     │ ←────┐  │
│  │  Random Forest Model    │      │  │
│  │  Port 5000              │      │  │
│  └─────────────────────────┘      │  │
├──────────────────────────────────────┤
│  Service (NodePort: 30500)           │
│  Routes to: Pod 1, Pod 2             │
└──────────────────────────────────────┘
         ↓ (Port Forward 5000:5000)
   http://localhost:5000
   (Flask API endpoints)
```

## 🛠️ System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| CPU Cores | 2 | 4+ |
| RAM | 2 GB | 8 GB |
| Disk Space | 10 GB | 20 GB |
| Docker | Already Installed | Latest |
| OS | Windows 10+/macOS/Linux | Windows 11/Latest |

## 📋 Prerequisites Checklist

- [ ] Docker Desktop installed and running
- [ ] 10+ GB free disk space
- [ ] Administrator privileges (for installation)
- [ ] Internet connection (for downloading images)
- [ ] Command line (PowerShell/Bash/Terminal)

## 🚀 30-Minute Express Path

If you're short on time, follow this express path:

```bash
# 1. Install (5 min)
choco install minikube kubernetes-cli -y  # Windows
# or
brew install minikube kubectl  # macOS

# 2. Start (3 min)
minikube start --driver=docker
minikube dashboard &

# 3. Deploy Web App (5 min)
cd task-2-kubernetes-deployment
eval $(minikube docker-env)  # Configure Docker
kubectl apply -f deployment.yaml
kubectl port-forward svc/curiousgaurav-service 8080:80 &
curl http://localhost:8080

# 4. Deploy ML Service (10 min)
cd ../task-3-ml-service
docker build -t curiousgaurav-ml-service:1.0 .
kubectl apply -f ml-service-deployment.yaml
kubectl port-forward svc/ml-service 5000:5000 &

# 5. Test Prediction (2 min)
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"features": [5.1, 3.5, 1.4, 0.2]}'
# Result: Prediction for Setosa flower
```

## 📚 Reference Documentation

- [Kubernetes Official Docs](https://kubernetes.io/docs/)
- [kubectl Commands](https://kubernetes.io/docs/reference/kubectl/)
- [Minikube Documentation](https://minikube.sigs.k8s.io/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [YAML Syntax](https://yaml.org/)

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| `minikube: command not found` | Reinstall or add to PATH |
| Docker daemon not running | Start Docker Desktop |
| Pods not starting | `kubectl describe pod <name>` → check logs |
| Port already in use | Use different port: `-p 8081:8080` |
| Image not found | Build in Minikube: `eval $(minikube docker-env)` |
| Out of memory | Allocate more: `minikube config set memory 8192` |

[See QUICK_REFERENCE.md for more troubleshooting](./QUICK_REFERENCE.md)

## 📈 Going Further

After completing all three tasks:

1. **Advanced Minikube**: Try different drivers, profiles, registries
2. **Advanced Kubernetes**: StatefulSets, DaemonSets, Jobs, CronJobs
3. **Production**: Deploy to cloud (AWS ECS, Google GKE, Azure AKS)
4. **Monitoring**: Add Prometheus and Grafana
5. **Service Mesh**: Explore Istio or Linkerd
6. **ML Frameworks**: Try TensorFlow, PyTorch serving

## 🎓 Topics Covered

### Kubernetes Concepts
- Pods and containers
- Deployments and replica sets
- Services and service discovery
- Namespaces and RBAC
- ConfigMaps and secrets

### DevOps Practices
- Infrastructure as Code (YAML)
- Containerization (Docker)
- Health checks and probes
- Resource management
- Logging and monitoring

### ML Operations (MLOps)
- Model containerization
- REST API deployment
- Batch prediction processing
- Model versioning
- Service scaling

## ✅ Success Metrics

- ✅ Minikube cluster running with 3+ pods
- ✅ Web application accessible at localhost:8080
- ✅ ML service responding to predictions at localhost:5000
- ✅ Pods can be scaled up/down
- ✅ Application survives pod crashes (auto-restart)
- ✅ Service provides stable access point

## 📞 Get Help

```bash
# Minikube help
minikube help
minikube logs
minikube status

# kubectl help
kubectl --help
kubectl <command> --help

# Check logs
kubectl logs <pod-name>
kubectl logs -f <pod-name>  # Follow

# Debug
kubectl describe pod <pod-name>
kubectl exec -it <pod-name> -- /bin/bash
```

## 🎉 Completion Certificate

After completing all three tasks, you should be able to:
- ✅ Install and manage Minikube clusters
- ✅ Read and understand Kubernetes YAML manifests
- ✅ Deploy applications using kubectl
- ✅ Monitor and debug containerized services
- ✅ Scale applications on demand
- ✅ Expose services to external traffic
- ✅ Deploy machine learning models as microservices
- ✅ Make predictions via REST APIs

---

## 📚 Next Steps

1. **Start with Task 1**: [MINIKUBE_INSTALLATION.md](./task-1-minikube-setup/MINIKUBE_INSTALLATION.md)
2. **Then Task 2**: [DEPLOYMENT_COMMANDS.md](./task-2-kubernetes-deployment/DEPLOYMENT_COMMANDS.md)
3. **Finally Task 3**: [ML_SERVICE_GUIDE.md](./task-3-ml-service/ML_SERVICE_GUIDE.md)
4. **Reference**: [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for command cheat sheet

**Estimated Total Time**: 60-90 minutes  
**Difficulty**: Beginner to Intermediate  
**Prerequisites**: Docker installed, basic command line skills

Let's get started! 🚀
