# Minikube Tasks - Complete Summary

## 🎓 What You'll Learn

### Three Progressive Tasks to Master Kubernetes

## Task 1: Minikube Installation & Dashboard (15 minutes)

**Objective**: Set up local Kubernetes cluster and explore the dashboard

**Key Files**:
- `task-1-minikube-setup/MINIKUBE_INSTALLATION.md` - Step-by-step installation
- `task-1-minikube-setup/MINIKUBE_COMMANDS.md` - 50+ kubectl & minikube commands

**Skills**:
- Install Minikube on Windows/macOS/Linux
- Use Docker driver for lightweight clusters
- Navigate Kubernetes Dashboard
- Understand cluster architecture

**Quick Commands**:
```bash
minikube start --driver=docker --cpus=2 --memory=4096
minikube dashboard
minikube status
kubectl cluster-info
```

---

## Task 2: Deploy Web Application (20 minutes)

**Objective**: Deploy a containerized application and master Kubernetes YAML

**Key Files**:
- `task-2-kubernetes-deployment/deployment.yaml` - Complete deployment + service
- `task-2-kubernetes-deployment/deployment-explained.md` - Line-by-line YAML breakdown
- `task-2-kubernetes-deployment/DEPLOYMENT_COMMANDS.md` - kubectl commands

**YAML Concepts Covered**:
- **apiVersion**: `apps/v1` - Kubernetes API version
- **kind**: `Deployment` - Resource type
- **metadata**: Name, labels, namespace
- **spec.replicas**: Number of pod copies
- **spec.selector.matchLabels**: Pod selection criteria
- **spec.template**: Pod blueprint
- **spec.containers**: Container details (image, ports, resources)
- **livenessProbe**: Container health check
- **readinessProbe**: Traffic readiness check
- **Service**: Network exposure (NodePort/ClusterIP/LoadBalancer)

**Deployment Architecture**:
```
┌─ Deployment ─────────┐
│  replicas: 3         │
│  ┌─ Pod 1 ──────────┐│
│  │ container: nginx ││
│  │ port: 80         ││
│  └──────────────────┘│
│  ┌─ Pod 2 ──────────┐│  Load Balanced
│  │ container: nginx ││  by Service
│  │ port: 80         ││
│  └──────────────────┘│
│  ┌─ Pod 3 ──────────┐│
│  │ container: nginx ││
│  │ port: 80         ││
│  └──────────────────┘│
└──────────────────────┘
        ↓
    Service
  (NodePort: 30080)
```

**Practical Skills**:
- Create deployment from YAML
- Verify pod status and readiness
- Check pod logs and events
- Execute commands inside pods
- Scale deployments up/down
- Port forward to access application
- Debug pod issues

**Quick Workflow**:
```bash
kubectl apply -f deployment.yaml
kubectl get pods -w                    # Watch pods
kubectl describe pod <name>            # Details
kubectl logs <pod>                     # Logs
kubectl exec -it <pod> -- /bin/bash   # Shell access
kubectl port-forward svc/<svc> 8080:80
# Access at http://localhost:8080
```

---

## Task 3: ML-as-a-Service (30 minutes)

**Objective**: Deploy machine learning microservice and make predictions

**Key Files**:
- `task-3-ml-service/ml_app.py` - Flask REST API with 8+ endpoints
- `task-3-ml-service/Dockerfile` - Container with ML dependencies
- `task-3-ml-service/ml-service-deployment.yaml` - K8s deployment YAML
- `task-3-ml-service/ML_SERVICE_GUIDE.md` - Complete deployment guide
- `task-3-ml-service/test-predictions.sh` - Automated test script

**ML Service Architecture**:
```
Input (4 features)      Random Forest        Output (class + confidence)
[5.1, 3.5, 1.4, 0.2] → Classifier (100 trees) → {class: "setosa", conf: 0.99}
```

**Iris Dataset**:
- **Features** (4):
  - Sepal Length (cm)
  - Sepal Width (cm)
  - Petal Length (cm)
  - Petal Width (cm)
  
- **Classes** (3):
  - Setosa (small flower)
  - Versicolor (medium flower)
  - Virginica (large flower)

**API Endpoints**:
```
GET  /                    - Welcome
GET  /health             - Health check
GET  /api/info           - Service info
GET  /api/features       - Feature names
GET  /api/classes        - Class names
POST /api/predict        - Single prediction
POST /api/predict-batch  - Batch predictions
GET  /metrics            - Service metrics
```

**Example Predictions**:

1. **Setosa** (Small flower):
```bash
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"features": [5.1, 3.5, 1.4, 0.2]}'
# Response: {"prediction": {"class_name": "setosa", "confidence": 0.99}}
```

2. **Versicolor** (Medium flower):
```bash
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"features": [7.0, 3.2, 4.7, 1.4]}'
# Response: {"prediction": {"class_name": "versicolor", "confidence": 0.98}}
```

3. **Virginica** (Large flower):
```bash
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"features": [6.3, 3.3, 6.0, 2.5]}'
# Response: {"prediction": {"class_name": "virginica", "confidence": 0.97}}
```

**Batch Prediction**:
```bash
curl -X POST http://localhost:5000/api/predict-batch \
  -H "Content-Type: application/json" \
  -d '{"samples": [[5.1, 3.5, 1.4, 0.2], [7.0, 3.2, 4.7, 1.4], [6.3, 3.3, 6.0, 2.5]]}'
# Returns: Array of 3 predictions
```

**Deployment Features**:
- 2 replicas for load distribution
- Health checks (liveness + readiness)
- Resource limits (1GB RAM max)
- Rolling update strategy
- Flask microservice

**Quick Workflow**:
```bash
cd task-3-ml-service
docker build -t curiousgaurav-ml-service:1.0 .
kubectl apply -f ml-service-deployment.yaml
kubectl wait --for=condition=ready pod -l app=ml-service --timeout=300s
kubectl port-forward svc/ml-service 5000:5000
# Now make predictions at http://localhost:5000
```

---

## 📊 Complete Workflow (60 minutes)

```bash
# 1. START MINIKUBE (5 min)
minikube start --driver=docker --cpus=2 --memory=4096
minikube dashboard &

# 2. DEPLOY WEB APP (15 min)
cd task-2-kubernetes-deployment
eval $(minikube docker-env)  # Configure Docker
kubectl apply -f deployment.yaml
kubectl wait --for=condition=ready pod -l app=web-server --timeout=300s
kubectl get pods
kubectl port-forward svc/curiousgaurav-service 8080:80 &
curl http://localhost:8080

# 3. BUILD ML SERVICE (10 min)
cd ../task-3-ml-service
docker build -t curiousgaurav-ml-service:1.0 .

# 4. DEPLOY ML SERVICE (10 min)
kubectl apply -f ml-service-deployment.yaml
kubectl wait --for=condition=ready pod -l app=ml-service --timeout=300s
kubectl get pods

# 5. TEST PREDICTIONS (10 min)
kubectl port-forward svc/ml-service 5000:5000 &

# Setosa
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"features": [5.1, 3.5, 1.4, 0.2]}'

# Versicolor
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"features": [7.0, 3.2, 4.7, 1.4]}'

# Virginica
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"features": [6.3, 3.3, 6.0, 2.5]}'

# CLEANUP
kubectl delete -f ml-service-deployment.yaml
kubectl delete -f deployment.yaml
minikube stop
```

---

## 🎯 Learning Outcomes

After completing all three tasks:

### Kubernetes Mastery
- ✅ Understand Pod lifecycle
- ✅ Master Deployment YAML structure
- ✅ Configure health checks (liveness + readiness)
- ✅ Set resource requests and limits
- ✅ Expose services and port mapping
- ✅ Scale applications horizontally
- ✅ Debug pods with logs and exec
- ✅ Monitor pod status and events

### DevOps Skills
- ✅ Infrastructure as Code (YAML)
- ✅ Containerization best practices
- ✅ Microservice architecture
- ✅ Service mesh concepts
- ✅ Logging and monitoring
- ✅ Health checks and probes
- ✅ Rolling updates and rollbacks

### ML Ops (MLOps)
- ✅ Model containerization
- ✅ REST API design
- ✅ Microservice deployment
- ✅ Batch prediction processing
- ✅ Model versioning
- ✅ Horizontal scaling for ML

---

## 🛠️ Key Commands Reference

### Minikube
```bash
minikube start --driver=docker
minikube stop
minikube delete
minikube dashboard
minikube ip
minikube logs
```

### kubectl
```bash
kubectl apply -f file.yaml
kubectl get pods/deployments/services
kubectl describe pod <name>
kubectl logs <pod>
kubectl exec -it <pod> -- /bin/bash
kubectl port-forward svc/<svc> 8080:80
kubectl scale deployment <name> --replicas=5
kubectl delete -f file.yaml
```

### Kubectl Logs & Debugging
```bash
kubectl logs <pod>
kubectl logs -f <pod>              # Follow
kubectl logs <pod> --previous      # Previous run
kubectl describe pod <pod>         # Full details
kubectl get events                 # Cluster events
kubectl exec -it <pod> -- ls -la   # Run command
```

---

## 📚 Documentation Index

| File | Purpose |
|------|---------|
| COMPLETE_SETUP_GUIDE.md | Full overview (start here!) |
| QUICK_REFERENCE.md | Command cheat sheet |
| task-1-minikube-setup/MINIKUBE_INSTALLATION.md | Installation steps |
| task-1-minikube-setup/MINIKUBE_COMMANDS.md | 50+ kubectl/minikube commands |
| task-2-kubernetes-deployment/deployment.yaml | Ready-to-use deployment YAML |
| task-2-kubernetes-deployment/deployment-explained.md | YAML field-by-field breakdown |
| task-2-kubernetes-deployment/DEPLOYMENT_COMMANDS.md | kubectl command guide |
| task-3-ml-service/ml_app.py | Flask ML microservice (300+ lines) |
| task-3-ml-service/ML_SERVICE_GUIDE.md | Complete deployment guide |
| task-3-ml-service/test-predictions.sh | Automated test script |

---

## 🎓 Difficulty Progression

1. **Task 1** (Beginner)
   - Install software
   - Start cluster
   - Explore dashboard
   - Learn basic commands

2. **Task 2** (Intermediate)
   - Understand YAML structure
   - Create deployments
   - Verify pod status
   - Debug issues
   - Monitor applications

3. **Task 3** (Intermediate)
   - Build ML service
   - Deploy microservice
   - Make predictions
   - Batch processing
   - Performance monitoring

---

## ⏱️ Time Estimates

| Task | Duration | Difficulty |
|------|----------|-----------|
| Task 1 | 15 min | ⭐ Easy |
| Task 2 | 20 min | ⭐⭐ Medium |
| Task 3 | 30 min | ⭐⭐ Medium |
| **Total** | **65 min** | **Beginner→Intermediate** |

---

## 🚀 System Requirements

- **CPU**: 2+ cores (4 recommended)
- **RAM**: 2+ GB (4 GB recommended)
- **Disk**: 10+ GB free
- **Docker**: Already installed
- **OS**: Windows 10+, macOS, or Linux

---

## 📞 Common Issues

| Issue | Solution |
|-------|----------|
| Pods not starting | Check: `kubectl describe pod <name>` |
| Connection refused | Use port-forward: `kubectl port-forward svc/<svc> 8080:80` |
| Image not found | Build in Minikube: `eval $(minikube docker-env)` |
| Out of memory | Scale down: `kubectl scale deployment <name> --replicas=1` |
| Stuck terminating | Force delete: `kubectl delete pod <name> --grace-period=0 --force` |

---

## ✅ Success Checklist

- [ ] Minikube running (3+ nodes visible in dashboard)
- [ ] Web app deployed (3 pods running)
- [ ] Web app accessible at localhost:8080
- [ ] ML service deployed (2 pods running)
- [ ] ML service accessible at localhost:5000
- [ ] Predictions working (tried all 3 flower types)
- [ ] Can scale deployment to 5 replicas
- [ ] Can view pod logs and details

---

## 🎉 Next Steps

1. **Modify Applications**
   - Change ML model to different dataset
   - Add new API endpoints
   - Experiment with different resources

2. **Advanced Kubernetes**
   - StatefulSets for databases
   - DaemonSets for monitoring
   - Jobs for batch processing
   - Ingress for advanced routing

3. **Production Deployment**
   - Push to Docker Hub
   - Deploy to cloud (AWS, GCP, Azure)
   - Set up CI/CD pipeline
   - Add monitoring and logging

---

## 📖 External Resources

- [Kubernetes Official Docs](https://kubernetes.io/docs/)
- [kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)
- [Minikube Documentation](https://minikube.sigs.k8s.io/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

## 📝 Authors & License

- **Author**: @curiousgaurav
- **License**: MIT
- **Last Updated**: April 2026

---

## 🎯 Your Next Move

👉 **Start Here**: [Read COMPLETE_SETUP_GUIDE.md](./COMPLETE_SETUP_GUIDE.md)

Then follow:
1. Task 1: [MINIKUBE_INSTALLATION.md](./task-1-minikube-setup/MINIKUBE_INSTALLATION.md)
2. Task 2: [DEPLOYMENT_COMMANDS.md](./task-2-kubernetes-deployment/DEPLOYMENT_COMMANDS.md)
3. Task 3: [ML_SERVICE_GUIDE.md](./task-3-ml-service/ML_SERVICE_GUIDE.md)

**Expected Time to Complete**: 1 hour
**Difficulty**: Beginner to Intermediate
**Prerequisite**: Docker installed

Good luck! 🚀
