# Task 2: Kubernetes Deployment Commands Guide

## Objective
Deploy containerized application on Minikube, explore YAML deployment file, and verify pod status.

## Prerequisites

```bash
# 1. Minikube should be running
minikube status

# Expected output:
# minikube: Running
# kubelet: Running
# apiserver: Running
# kubeconfig: Configured

# 2. Check kubectl connection
kubectl cluster-info

# 3. Switch to Minikube context
kubectl config use-context minikube
```

## Step-by-Step Deployment

### Step 1: Deploy Application

```bash
# Navigate to deployment directory
cd task-2-kubernetes-deployment

# Apply deployment from YAML file
kubectl apply -f deployment.yaml

# Check status (should show creation in progress)
kubectl get deployments

# Expected output:
# NAME                           READY   UP-TO-DATE   AVAILABLE   AGE
# curiousgaurav-deployment       0/3     3            0           5s
```

### Step 2: Wait for Pods to be Ready

```bash
# Watch pod creation in real-time
kubectl get pods -w

# Exit watch: Press Ctrl+C

# Check final status
kubectl get pods

# Expected output (after ~30 seconds):
# NAME                                      READY   STATUS    RESTARTS   AGE
# curiousgaurav-deployment-xxxx-yyyy        1/1     Running   0          30s
# curiousgaurav-deployment-xxxx-zzzz        1/1     Running   0          28s
# curiousgaurav-deployment-xxxx-aaaa        1/1     Running   0          26s
```

### Step 3: Verify Deployment Details

```bash
# Get deployment details
kubectl describe deployment curiousgaurav-deployment

# Key information to look for:
# - Replicas: 3 desired, 3 updated, 3 total, 3 available
# - Pod Template (container config)
# - Events (creation history)

# Get deployment YAML (with actual values)
kubectl get deployment curiousgaurav-deployment -o yaml

# Get as JSON
kubectl get deployment curiousgaurav-deployment -o json
```

### Step 4: Verify Pods

```bash
# List all pods with details
kubectl get pods -o wide

# Output shows:
# - Pod names
# - Ready status (1/1 = 1 ready out of 1 container)
# - Status (Running)
# - Node assignment
# - Internal IP address
# - Restarts count
```

### Step 5: Verify Service

```bash
# List services
kubectl get services

# Expected output:
# NAME                       TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)
# curiousgaurav-service      NodePort   10.96.xxx.xxx   <none>        80:30080/TCP

# Get service details
kubectl describe service curiousgaurav-service

# Get service YAML
kubectl get svc curiousgaurav-service -o yaml
```

## Exploring Pods

### Pod Information

```bash
# Get specific pod name (use one from kubectl get pods output)
POD_NAME=$(kubectl get pods -o jsonpath='{.items[0].metadata.name}')
echo $POD_NAME

# Describe pod
kubectl describe pod $POD_NAME

# Shows:
# - Pod name, namespace, labels
# - Node assignment
# - Container details (image, ports)
# - Resource usage
# - Volumes
# - Events

# Get pod YAML
kubectl get pod $POD_NAME -o yaml

# Get pod YAML with minimal output
kubectl get pod $POD_NAME -o yaml --export
```

### Pod Logs

```bash
# Get pod logs
kubectl logs $POD_NAME

# Follow logs in real-time (like tail -f)
kubectl logs -f $POD_NAME

# Get specific number of lines
kubectl logs $POD_NAME --tail=20

# Get logs with timestamps
kubectl logs $POD_NAME -t

# Get logs from all pods in deployment
kubectl logs -l app=web-server

# Get logs from previous pod (if pod crashed and restarted)
kubectl logs $POD_NAME --previous
```

### Enter Pod Interactive Shell

```bash
# Execute interactive bash in pod
kubectl exec -it $POD_NAME -- /bin/bash

# Or /bin/sh for Alpine-based images
kubectl exec -it $POD_NAME -- /bin/sh

# Inside pod shell, can run commands:
ls -la
cat /etc/nginx/nginx.conf
env | grep APP_NAME
curl http://localhost:80

# Exit shell: Ctrl+D or type 'exit'
```

### Execute Commands in Pod

```bash
# Run single command
kubectl exec $POD_NAME -- ls -la

# Get environment variables
kubectl exec $POD_NAME -- env

# Check running processes
kubectl exec $POD_NAME -- ps aux

# Get pod IP
kubectl exec $POD_NAME -- hostname -i

# Check file contents
kubectl exec $POD_NAME -- cat /etc/hostname

# Get running services
kubectl exec $POD_NAME -- netstat -tulpn
```

## Exploring Deployment YAML Structure

### View Actual Deployment YAML

```bash
# Display formatted YAML
kubectl get deployment curiousgaurav-deployment -o yaml

# Display specific fields
kubectl get deployment curiousgaurav-deployment -o jsonpath='{.spec.replicas}'

# Display pod template
kubectl get deployment curiousgaurav-deployment -o jsonpath='{.spec.template.spec.containers[0].image}'

# Display all labels
kubectl get deployment curiousgaurav-deployment -o jsonpath='{.metadata.labels}'
```

### YAML Field Breakdown

```bash
# apiVersion
kubectl get deployment curiousgaurav-deployment -o jsonpath='{.apiVersion}'
# Output: apps/v1

# kind
kubectl get deployment curiousgaurav-deployment -o jsonpath='{.kind}'
# Output: Deployment

# metadata.name
kubectl get deployment curiousgaurav-deployment -o jsonpath='{.metadata.name}'

# spec.replicas
kubectl get deployment curiousgaurav-deployment -o jsonpath='{.spec.replicas}'

# spec.selector.matchLabels
kubectl get deployment curiousgaurav-deployment -o jsonpath='{.spec.selector.matchLabels}'

# spec.template.metadata.labels
kubectl get deployment curiousgaurav-deployment -o jsonpath='{.spec.template.metadata.labels}'

# Container details
kubectl get deployment curiousgaurav-deployment -o jsonpath='{.spec.template.spec.containers[0].name}'
kubectl get deployment curiousgaurav-deployment -o jsonpath='{.spec.template.spec.containers[0].image}'
kubectl get deployment curiousgaurav-deployment -o jsonpath='{.spec.template.spec.containers[0].ports}'

# Resources
kubectl get deployment curiousgaurav-deployment -o jsonpath='{.spec.template.spec.containers[0].resources}'

# Probes
kubectl get deployment curiousgaurav-deployment -o jsonpath='{.spec.template.spec.containers[0].livenessProbe}'
```

### Edit Deployment

```bash
# Edit deployment in default editor
kubectl edit deployment curiousgaurav-deployment

# Changes apply immediately

# Changes you can make:
# - Increase/decrease replicas
# - Change image
# - Add/remove environment variables
# - Modify resource limits
# - Add probes
```

## Deployment Operations

### Scale Deployment

```bash
# Scale to 5 replicas
kubectl scale deployment curiousgaurav-deployment --replicas=5

# Verify scaling
kubectl get pods -w  # Watch pods being created

# Scale down to 1
kubectl scale deployment curiousgaurav-deployment --replicas=1
```

### Update Deployment Image

```bash
# Update container image
kubectl set image deployment/curiousgaurav-deployment \
  nginx-container=nginx:1.21 \
  --record

# Monitor rollout
kubectl rollout status deployment/curiousgaurav-deployment

# View update progress
kubectl get pods -w
```

### Explore Deployment Rollout History

```bash
# View rollout status
kubectl rollout status deployment/curiousgaurav-deployment

# View rollout history
kubectl rollout history deployment/curiousgaurav-deployment

# View specific revision details
kubectl rollout history deployment/curiousgaurav-deployment --revision=1

# Rollback to previous version
kubectl rollout undo deployment/curiousgaurav-deployment

# Rollback to specific revision
kubectl rollout undo deployment/curiousgaurav-deployment --to-revision=1

# Monitor rollback
kubectl rollout status deployment/curiousgaurav-deployment
```

## Accessing Application

### Method 1: Port Forward

```bash
# Forward local port to service
kubectl port-forward svc/curiousgaurav-service 8080:80

# In another terminal, access:
curl http://localhost:8080
# or open in browser: http://localhost:8080

# To stop: Ctrl+C
```

### Method 2: NodePort via Minikube IP

```bash
# Get Minikube IP
MINIKUBE_IP=$(minikube ip)
echo $MINIKUBE_IP

# Service is exposed on port 30080 (defined in YAML)
curl http://$MINIKUBE_IP:30080

# Or in browser: http://<minikube-ip>:30080
```

### Method 3: Access from Pod to Pod

```bash
# Get pod IP
POD_IP=$(kubectl get pod $POD_NAME -o jsonpath='{.status.podIP}')
echo $POD_IP

# Access from another pod
kubectl exec another-pod -- curl http://$POD_IP:80

# Or via service name (works within cluster)
kubectl exec $POD_NAME -- curl http://curiousgaurav-service:80
```

## Pod Status Verification Commands

### Check Pod Readiness

```bash
# Simple readiness check
kubectl get pods

# Detailed readiness check
kubectl get pods -o wide

# Very detailed (includes node info)
kubectl describe pods

# JSON output with full details
kubectl get pods -o json

# Check specific conditions
kubectl get pods -o jsonpath='{.items[*].status.conditions[*].type}'
```

### Monitor Probes

```bash
# Describe pod to see probe results
kubectl describe pod $POD_NAME

# Look for "Liveness" and "Readiness" sections

# Check events
kubectl get events --sort-by='.lastTimestamp'

# Real-time monitoring
kubectl get pods -w
```

### Check Resources Usage

```bash
# Enable metrics-server (required for metrics)
minikube addons enable metrics-server

# Wait for metrics-server to start (1-2 minutes)
kubectl wait --for=condition=ready pod -l k8s-app=metrics-server -n kube-system

# Check node resources
kubectl top nodes

# Check pod resources
kubectl top pods

# Check with namespace
kubectl top pods -n default
```

## Troubleshooting Commands

### Pod Not Running

```bash
# Check pod status
kubectl get pods

# Describe pod for errors
kubectl describe pod $POD_NAME

# Check events
kubectl get events

# Check logs
kubectl logs $POD_NAME

# Check previous logs (if pod restarted)
kubectl logs $POD_NAME --previous
```

### Debug Pod Issues

```bash
# Get pod details in YAML
kubectl get pod $POD_NAME -o yaml

# Check container image
kubectl get pod $POD_NAME -o jsonpath='{.spec.containers[0].image}'

# Check environment variables
kubectl exec $POD_NAME -- env

# Check mounted volumes
kubectl describe pod $POD_NAME | grep -A 10 Mounts

# Check network connectivity
kubectl exec $POD_NAME -- ping 8.8.8.8

# Check DNS
kubectl exec $POD_NAME -- nslookup kubernetes.default
```

## Complete Testing Workflow

```bash
# 1. Apply deployment
kubectl apply -f deployment.yaml

# 2. Wait for pods
kubectl wait --for=condition=ready pod -l app=web-server --timeout=300s

# 3. Get pod details
kubectl get pods -o wide

# 4. Describe pod
kubectl describe pod $(kubectl get pods -o jsonpath='{.items[0].metadata.name}')

# 5. Check logs
kubectl logs $(kubectl get pods -o jsonpath='{.items[0].metadata.name}')

# 6. Test connectivity
kubectl port-forward svc/curiousgaurav-service 8080:80

# In another terminal:
curl http://localhost:8080

# 7. Scale to 5
kubectl scale deployment curiousgaurav-deployment --replicas=5

# 8. Verify 5 pods
kubectl get pods

# 9. Check resources
kubectl top pods

# 10. Cleanup
kubectl delete -f deployment.yaml
```

## Quick Reference Table

| Task | Command |
|------|---------|
| Apply deployment | `kubectl apply -f deployment.yaml` |
| List pods | `kubectl get pods` |
| List deployments | `kubectl get deployments` |
| Describe deployment | `kubectl describe deployment curiousgaurav-deployment` |
| Get pod details | `kubectl describe pod <pod-name>` |
| Pod logs | `kubectl logs <pod-name>` |
| Enter pod shell | `kubectl exec -it <pod-name> -- /bin/bash` |
| Port forward | `kubectl port-forward svc/curiousgaurav-service 8080:80` |
| Scale deployment | `kubectl scale deployment curiousgaurav-deployment --replicas=5` |
| Watch pods | `kubectl get pods -w` |
| Delete all | `kubectl delete -f deployment.yaml` |

---

**Next**: See [../task-3-ml-service/](../task-3-ml-service/) for ML microservice deployment.
