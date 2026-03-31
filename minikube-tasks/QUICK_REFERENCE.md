# Minikube Lab - Quick Reference Guide

## 🚀 Quick Start (5 Minutes)

### Installation & Setup
```bash
# Install Minikube (Windows PowerShell as Administrator)
choco install minikube kubernetes-cli -y

# Start Minikube with Docker driver
minikube start --driver=docker --cpus=2 --memory=4096

# Verify
minikube status
kubectl cluster-info

# Open Dashboard
minikube dashboard &
```

### Task 2: Deploy Application
```bash
# Configure Docker
eval $(minikube docker-env)  # Linux/macOS
# minikube docker-env | Invoke-Expression  # Windows PowerShell

# Deploy
cd task-2-kubernetes-deployment
kubectl apply -f deployment.yaml

# Verify
kubectl get pods

# Access
kubectl port-forward svc/curiousgaurav-service 8080:80 &
curl http://localhost:8080
```

### Task 3: Deploy ML Service
```bash
# Build image
cd task-3-ml-service
docker build -t curiousgaurav-ml-service:1.0 .

# Deploy
kubectl apply -f ml-service-deployment.yaml

# Verify
kubectl get pods -l app=ml-service

# Test prediction
kubectl port-forward svc/ml-service 5000:5000 &
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"features": [5.1, 3.5, 1.4, 0.2]}'
```

## 📚 Key Commands

### Minikube Management
| Command | Purpose |
|---------|---------|
| `minikube start --driver=docker` | Start cluster |
| `minikube stop` | Stop cluster |
| `minikube delete` | Delete cluster |
| `minikube status` | Check status |
| `minikube dashboard` | Open web dashboard |
| `minikube ip` | Get cluster IP |
| `minikube logs` | View Minikube logs |

### kubectl Cluster Commands
| Command | Purpose |
|---------|---------|
| `kubectl cluster-info` | Cluster information |
| `kubectl get nodes` | List nodes |
| `kubectl config current-context` | Current context |
| `kubectl get namespaces` | List namespaces |

### kubectl Deployment Commands
| Command | Purpose |
|---------|---------|
| `kubectl apply -f file.yaml` | Deploy from YAML |
| `kubectl get deployments` | List deployments |
| `kubectl get pods` | List pods |
| `kubectl describe pod <name>` | Pod details |
| `kubectl logs <pod>` | View pod logs |
| `kubectl exec -it <pod> -- /bin/bash` | Enter pod shell |
| `kubectl delete deployment <name>` | Delete deployment |

### kubectl Service Commands
| Command | Purpose |
|---------|---------|
| `kubectl get services` | List services |
| `kubectl describe svc <name>` | Service details |
| `kubectl port-forward svc/<name> 8080:80` | Port forwarding |
| `kubectl logs -f <pod>` | Live log stream |

### kubectl Scaling & Monitoring
| Command | Purpose |
|---------|---------|
| `kubectl scale deployment <name> --replicas=5` | Scale pods |
| `kubectl top nodes` | Node resources |
| `kubectl top pods` | Pod resources |
| `kubectl get pods -w` | Watch pods (live) |

## 📋 YAML Structure Cheat Sheet

### Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: container
        image: image:tag
        ports:
        - containerPort: 8080
```

### Service
```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  type: NodePort  # or LoadBalancer, ClusterIP
  selector:
    app: my-app
  ports:
  - port: 80
    targetPort: 8080
    nodePort: 30000
```

## 🔍 Debugging Checklist

```bash
# 1. Check pod status
kubectl get pods
kubectl describe pod <pod-name>

# 2. Check logs
kubectl logs <pod-name>
kubectl logs -f <pod-name>  # Live

# 3. Check events
kubectl get events --sort-by='.lastTimestamp'

# 4. Check service
kubectl get svc
kubectl get endpoints <service-name>

# 5. Verify connectivity
kubectl port-forward svc/<service> 8080:80
# In another terminal:
curl http://localhost:8080

# 6. Enter pod shell
kubectl exec -it <pod> -- /bin/bash

# 7. Check resource usage
kubectl top pods
```

## 🎯 Common Tasks

### Deploy Application
```bash
kubectl apply -f my-deployment.yaml
kubectl get pods -w  # Watch deployment
```

### Scale Application
```bash
kubectl scale deployment my-app --replicas=5
kubectl get pods  # Verify scaling
```

### Update Application
```bash
docker build -t my-app:2.0 .
kubectl set image deployment/my-app app=my-app:2.0
kubectl rollout status deployment/my-app
```

### Access Application
```bash
# Option 1: Port forwarding
kubectl port-forward svc/my-service 8080:80

# Option 2: Via Minikube IP
MINIKUBE_IP=$(minikube ip)
curl http://$MINIKUBE_IP:30000

# Option 3: Pod to pod
CLUSTERIP=$(kubectl get svc my-service -o jsonpath='{.spec.clusterIP}')
curl http://$CLUSTERIP
```

### Run Debug Pod
```bash
kubectl run -it debug --image=alpine --restart=Never -- /bin/sh
# Inside pod:
apk add curl
curl http://my-service:80
```

### Delete Resources
```bash
# Delete deployment + service
kubectl delete -f deployment.yaml

# Delete specific resource
kubectl delete deployment my-deployment
kubectl delete svc my-service

# Delete all in namespace
kubectl delete all --all
```

## 📊 YAML Field Reference

### apiVersion
- `apps/v1` - Deployments, StatefulSets
- `v1` - Services, Pods, ConfigMaps
- `batch/v1` - Jobs, CronJobs

### kind
- `Deployment` - Manage pods with replicas
- `Service` - Network abstraction
- `Pod` - Smallest k8s unit
- `ConfigMap` - Store config
- `Secret` - Store secrets

### Deployment.spec
- `replicas: 3` - Number of pod copies
- `strategy.type: RollingUpdate` - Update strategy
- `selector.matchLabels` - Pod selector

### Pod Container
- `image: nginx:latest` - Container image
- `ports: [containerPort: 80]` - Exposed ports
- `resources.requests` - Minimum resources
- `resources.limits` - Maximum resources
- `livenessProbe` - Health check
- `readinessProbe` - Ready check

### Service.spec
- `type: NodePort` - External access
- `type: ClusterIP` - Internal only
- `type: LoadBalancer` - Cloud LB
- `port: 80` - Service port
- `targetPort: 8080` - Container port
- `nodePort: 30000` - External port

## 🐳 Docker Integration

### Build in Minikube
```bash
# Point Docker to Minikube
eval $(minikube docker-env)

# Build image (stored in Minikuke)
docker build -t my-app:1.0 .

# Image is immediately available
kubectl run my-pod --image=my-app:1.0
```

### Build Locally, Push to Registry
```bash
# Build locally
docker build -t myregistry/my-app:1.0 .

# Push to registry
docker push myregistry/my-app:1.0

# Use in Kubernetes
kubectl run my-pod --image=myregistry/my-app:1.0
```

## 🔧 Environment Variables

### In Deployment YAML
```yaml
env:
- name: DATABASE_URL
  value: "postgres://db:5432"
- name: DEBUG
  value: "true"
```

### In Container
```bash
echo $DATABASE_URL  # Inside pod
```

## 💾 Persistent Storage

### EmptyDir (Temporary)
```yaml
volumes:
- name: temp-volume
  emptyDir: {}
volumeMounts:
- name: temp-volume
  mountPath: /tmp
```

### ConfigMap (Read config)
```yaml
volumes:
- name: config
  configMap:
    name: my-config
volumeMounts:
- name: config
  mountPath: /etc/config
```

## 📈 Monitoring

### Enable Metrics
```bash
minikube addons enable metrics-server
sleep 60  # Wait for metrics
```

### View Metrics
```bash
kubectl top nodes      # Node resources
kubectl top pods       # Pod resources
```

### View Dashboard
```bash
minikube dashboard     # Web UI with graphs
```

## 🛠️ Troubleshooting Tips

| Issue | Solution |
|-------|----------|
| Pod not starting | `kubectl describe pod <name>` + `kubectl logs <name>` |
| Image not found | Build in Minikube: `eval $(minikube docker-env)` |
| Connection refused | Port forward: `kubectl port-forward svc/<name> 8080:80` |
| Out of resources | Scale down: `kubectl scale deployment <name> --replicas=1` |
| Pending pod | Check node resources: `kubectl top nodes` |
| Stuck terminating | Force delete: `kubectl delete pod <name> --grace-period=0 --force` |

## 🌐 Networking

### Service Discovery (within cluster)
```bash
# Service hostname: <service-name>.<namespace>.svc.cluster.local
# Short form: <service-name> (same namespace)

# Example:
curl http://my-service:80
curl http://my-service.default.svc.cluster.local:80
```

### Port Types
- **containerPort**: Port app listens on (inside pod)
- **port**: Service port (cluster IP)
- **targetPort**: Which pod port to forward to
- **nodePort**: External access (30000-32767)

## 📖 File Locations

```
Task 1: task-1-minikube-setup/
  - MINIKUBE_INSTALLATION.md
  - MINIKUBE_COMMANDS.md

Task 2: task-2-kubernetes-deployment/
  - deployment.yaml (Deployment + Service YAML)
  - deployment-explained.md (YAML field explanation)
  - DEPLOYMENT_COMMANDS.md (kubectl commands)

Task 3: task-3-ml-service/
  - ml_app.py (Flask ML application)
  - Dockerfile (Container definition)
  - ml-service-deployment.yaml (K8s YAML)
  - ml-service.yaml (Service YAML)
  - ML_SERVICE_GUIDE.md (Complete guide)
  - test-predictions.sh (Test script)
```

## ⏱️ Typical Workflow Time

| Task | Time |
|------|------|
| Install Minikube | 5 min |
| Start Minikube | 3 min |
| Open Dashboard | 1 min |
| Deploy web app | 3 min |
| Scale & monitor | 5 min |
| Deploy ML service | 5 min |
| Test predictions | 5 min |
| **Total** | **~30 min** |

## 📞 Quick Help

```bash
# Get help
minikube help
kubectl help
kubectl <command> --help

# Check logs
minikube logs
kubectl logs <pod>

# Debug pod
kubectl exec -it <pod> -- /bin/bash

# Check config
kubectl config view
minikube config view
```

## 🎓 Learning Path

1. **Basics**: Install, start Minikube, explore dashboard
2. **Deployment**: Deploy web app, understand YAML
3. **Monitoring**: Check pod status, view logs, scale
4. **Services**: Expose service, access from host
5. **ML**: Deploy ML model, make predictions
6. **Advanced**: Scaling, updates, networking, debugging

---

**Pro Tips:**
- Always use port forwarding for local testing
- Check pod logs first when debugging
- Use `-w` flag to watch changes in real-time
- Enable metrics-server for resource monitoring
- Label resources for better organization
- Use namespaces to separate environments

