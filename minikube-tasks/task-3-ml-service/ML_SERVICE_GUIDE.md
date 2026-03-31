# Task 3: ML-as-a-Service on Minikube

## Objective
Build, deploy, and test a machine learning microservice on Minikube. Expose the service and use it to make predictions.

## Overview

This ML service provides:
- **Model**: Random Forest Classifier for Iris Flower Classification
- **Framework**: Flask (Python web framework)
- **Dataset**: Iris Flower Dataset (150 samples, 4 features, 3 classes)
- **Deployment**: Kubernetes on Minikube
- **Exposure**: NodePort service

### Iris Dataset
- **Features**: Sepal Length, Sepal Width, Petal Length, Petal Width
- **Classes**: Setosa, Versicolor, Virginica
- **Input**: 4 numeric values (features)
- **Output**: Class name + confidence probability

## Prerequisites

```bash
# Verify Minikube is running
minikube status

# Verify Docker environment is configured
eval $(minikube docker-env)  # Linux/macOS
# OR
minikube docker-env | Invoke-Expression  # Windows PowerShell
```

## Step-by-Step Deployment

### Step 1: Build Docker Image in Minikube

```bash
# Navigate to task directory
cd task-3-ml-service

# Configure Docker to use Minikube daemon
eval $(minikube docker-env)  # Linux/macOS
# Windows PowerShell:
minikube docker-env | Invoke-Expression

# Build image inside Minikube
docker build -t curiousgaurav-ml-service:1.0 .

# Verify image is in Minikube
docker images | grep curiousgaurav-ml-service

# Expected output:
# curiousgaurav-ml-service   1.0       xxxx1234    200MB   2 hours ago
```

### Step 2: Deploy to Kubernetes

```bash
# Apply deployment YAML (includes deployment + service)
kubectl apply -f ml-service-deployment.yaml

# Check deployment status
kubectl get deployments

# Wait for pods to be ready
kubectl wait --for=condition=ready pod -l app=ml-service --timeout=300s

# Verify pods
kubectl get pods -l app=ml-service

# Expected output:
# NAME                                      READY   STATUS    RESTARTS   AGE
# ml-service-deployment-xxxx-yyyy          1/1     Running   0          30s
# ml-service-deployment-xxxx-zzzz          1/1     Running   0          28s
```

### Step 3: Verify Service

```bash
# List services
kubectl get services

# Expected output:
# NAME         TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)
# ml-service   NodePort   10.96.xxx.xxx   <none>        5000:30500/TCP

# Get service details
kubectl describe svc ml-service

# Get Minikube IP for external access
MINIKUBE_IP=$(minikube ip)
echo "Access service at: http://$MINIKUBE_IP:30500"
```

### Step 4: Check Pod Status

```bash
# Get pod details
POD_NAME=$(kubectl get pods -l app=ml-service -o jsonpath='{.items[0].metadata.name}')
echo "Pod: $POD_NAME"

# Check pod description
kubectl describe pod $POD_NAME

# View logs
kubectl logs $POD_NAME

# Follow logs in real-time
kubectl logs -f $POD_NAME

# Expected output:
# [2024-...] INFO: Starting curiousgaurav-ml-service (v1.0)
# [2024-...] INFO: Environment: production
# [2024-...] INFO: Listening on 0.0.0.0:5000
```

## Accessing the ML Service

### Method 1: Port Forwarding (Recommended for Testing)

```bash
# Forward local port to service
kubectl port-forward svc/ml-service 5000:5000

# Service is now accessible at http://localhost:5000

# In another terminal, test:
curl http://localhost:5000/health
```

### Method 2: NodePort via Minikube IP

```bash
# Get Minikube IP
MINIKUBE_IP=$(minikube ip)

# Service is exposed on port 30500
curl http://$MINIKUBE_IP:30500/health

# Or in browser:
# http://<minikube-ip>:30500
```

### Method 3: Access from Another Pod

```bash
# Service DNS name (within cluster): ml-service:5000

# Create debug pod
kubectl run -it debug-pod --image=python:3.11-slim -- /bin/bash

# Inside pod:
pip install requests
python -c "import requests; print(requests.get('http://ml-service:5000/').json())"
exit
```

## API Endpoints

### 1. Health Check
```bash
GET /health
```
**Response**: Service health status
```json
{
  "status": "healthy",
  "model_loaded": true,
  "service": "curiousgaurav-ml-service",
  "version": "1.0",
  "timestamp": "2024-01-15T10:30:45.123456"
}
```

### 2. Welcome Page
```bash
GET /
```
**Response**: Service information and available endpoints
```json
{
  "message": "Welcome to curiousgaurav-ml-service",
  "description": "ML-as-a-Service for Iris Flower Classification",
  "version": "1.0",
  "endpoints": { ... }
}
```

### 3. Service Information
```bash
GET /api/info
```

### 4. Get Features
```bash
GET /api/features
```
**Response**:
```json
{
  "features": [
    "sepal length (cm)",
    "sepal width (cm)",
    "petal length (cm)",
    "petal width (cm)"
  ],
  "count": 4
}
```

### 5. Get Classification Classes
```bash
GET /api/classes
```
**Response**:
```json
{
  "classes": ["setosa", "versicolor", "virginica"],
  "count": 3,
  "class_mapping": {
    "0": "setosa",
    "1": "versicolor",
    "2": "virginica"
  }
}
```

### 6. Single Prediction
```bash
POST /api/predict
Content-Type: application/json

{
  "features": [5.1, 3.5, 1.4, 0.2]
}
```

**Response**:
```json
{
  "prediction": {
    "class_id": 0,
    "class_name": "setosa",
    "confidence": 0.99
  },
  "probabilities": {
    "setosa": 0.99,
    "versicolor": 0.01,
    "virginica": 0.0
  },
  "input_features": [5.1, 3.5, 1.4, 0.2],
  "model_version": "1.0",
  "timestamp": "2024-01-15T10:35:20.456789"
}
```

### 7. Batch Predictions
```bash
POST /api/predict-batch
Content-Type: application/json

{
  "samples": [
    [5.1, 3.5, 1.4, 0.2],
    [7.0, 3.2, 4.7, 1.4],
    [6.3, 3.3, 6.0, 2.5]
  ]
}
```

**Response**:
```json
{
  "predictions": [
    {
      "sample_index": 0,
      "input": [5.1, 3.5, 1.4, 0.2],
      "prediction": {
        "class_id": 0,
        "class_name": "setosa",
        "confidence": 0.99
      },
      ...
    },
    ...
  ],
  "total_samples": 3,
  "model_version": "1.0"
}
```

### 8. Metrics
```bash
GET /metrics
```

## Testing Predictions

### Using curl (Command Line)

#### Test 1: Health Check
```bash
curl http://localhost:5000/health
```

#### Test 2: Predict Setosa (Small flower)
```bash
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"features": [5.1, 3.5, 1.4, 0.2]}'
```

#### Test 3: Predict Versicolor (Medium flower)
```bash
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"features": [7.0, 3.2, 4.7, 1.4]}'
```

#### Test 4: Predict Virginica (Large flower)
```bash
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"features": [6.3, 3.3, 6.0, 2.5]}'
```

#### Test 5: Batch Prediction
```bash
curl -X POST http://localhost:5000/api/predict-batch \
  -H "Content-Type: application/json" \
  -d '{
    "samples": [
      [5.1, 3.5, 1.4, 0.2],
      [7.0, 3.2, 4.7, 1.4],
      [6.3, 3.3, 6.0, 2.5]
    ]
  }'
```

### Using PowerShell (Windows)

```powershell
# Health check
$response = Invoke-WebRequest -Uri "http://localhost:5000/health" -Method Get
$response.Content | ConvertFrom-Json

# Single prediction
$body = @{features = @(5.1, 3.5, 1.4, 0.2)} | ConvertTo-Json
$response = Invoke-WebRequest -Uri "http://localhost:5000/api/predict" `
  -Method Post `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
$response.Content | ConvertFrom-Json
```

### Using Python Script

```python
import requests
import json

BASE_URL = "http://localhost:5000"

# Health check
response = requests.get(f"{BASE_URL}/health")
print("Health:", response.json())

# Single prediction
data = {"features": [5.1, 3.5, 1.4, 0.2]}
response = requests.post(f"{BASE_URL}/api/predict", json=data)
result = response.json()
print(f"Prediction: {result['prediction']['class_name']}")
print(f"Confidence: {result['prediction']['confidence']:.2%}")
print("Probabilities:")
for cls, prob in result['probabilities'].items():
    print(f"  {cls}: {prob:.2%}")

# Batch prediction
data = {
    "samples": [
        [5.1, 3.5, 1.4, 0.2],
        [7.0, 3.2, 4.7, 1.4],
        [6.3, 3.3, 6.0, 2.5]
    ]
}
response = requests.post(f"{BASE_URL}/api/predict-batch", json=data)
results = response.json()
print(f"Batch predictions: {len(results['predictions'])} samples processed")
```

### Using Bash Script

```bash
# Run the provided test script
chmod +x test-predictions.sh
./test-predictions.sh

# Or run individual commands
BASE_URL="http://localhost:5000"

# Health check
curl $BASE_URL/health | python -m json.tool

# Service info
curl $BASE_URL/api/info | python -m json.tool

# Make prediction
curl -X POST $BASE_URL/api/predict \
  -H "Content-Type: application/json" \
  -d '{"features": [5.1, 3.5, 1.4, 0.2]}' | python -m json.tool
```

## Monitoring & Debugging

### View Pod Logs

```bash
# Get pod name
POD_NAME=$(kubectl get pods -l app=ml-service -o jsonpath='{.items[0].metadata.name}')

# View logs
kubectl logs $POD_NAME

# Follow logs in real-time
kubectl logs -f $POD_NAME

# Get logs from all ML service pods
kubectl logs -l app=ml-service --all-containers=true
```

### Check Pod Metrics

```bash
# Enable metrics-server if not enabled
minikube addons enable metrics-server

# Wait for metrics to be available
sleep 60

# Check pod CPU and memory usage
kubectl top pods -l app=ml-service

# Expected output:
# NAME                                   CPU(m)   MEMORY(Mi)
# ml-service-deployment-xxxx-yyyy       50m      150Mi
# ml-service-deployment-xxxx-zzzz       45m      148Mi
```

### Interactive Debugging

```bash
# Get pod name
POD_NAME=$(kubectl get pods -l app=ml-service -o jsonpath='{.items[0].metadata.name}')

# Enter pod shell
kubectl exec -it $POD_NAME -- /bin/bash

# Inside pod:
ps aux                    # See running processes
cat /etc/os-release       # OS info
python --version          # Python version
pip list                  # Installed packages
curl http://localhost:5000/health  # Test locally
ls -la /app              # Check app files
```

### Check Environment Variables

```bash
POD_NAME=$(kubectl get pods -l app=ml-service -o jsonpath='{.items[0].metadata.name}')

# Get all environment variables
kubectl exec $POD_NAME -- env

# Get specific variable
kubectl exec $POD_NAME -- env | grep MODEL_NAME
```

## Scaling the Service

### Scale Deployment

```bash
# Scale to 5 replicas
kubectl scale deployment ml-service-deployment --replicas=5

# Watch pods being created
kubectl get pods -l app=ml-service -w

# Verify scaling
kubectl get deployment ml-service-deployment
```

### Load Distribution

```bash
# With 5 replicas, load is distributed
# Make multiple requests to see them hit different pods

# Get pod name of first request
for i in {1..10}; do
  curl http://localhost:5000/api/info | grep -i timestamp
done
```

## Updating Service

### Update Image

```bash
# Update ML model (rebuild Docker image)
docker build -t curiousgaurav-ml-service:2.0 .

# Update deployment to use new image
kubectl set image deployment/ml-service-deployment \
  ml-service-container=curiousgaurav-ml-service:2.0 \
  --record

# Monitor rollout
kubectl rollout status deployment/ml-service-deployment

# Watch pods being updated
kubectl get pods -l app=ml-service -w
```

### Rollback Update

```bash
# View rollout history
kubectl rollout history deployment/ml-service-deployment

# Rollback to previous version
kubectl rollout undo deployment/ml-service-deployment

# Verify rollback
kubectl rollout status deployment/ml-service-deployment
```

## Cleanup

```bash
# Delete deployment and service
kubectl delete -f ml-service-deployment.yaml

# Verify deletion
kubectl get pods -l app=ml-service

# Delete Docker image (optional)
docker rmi curiousgaurav-ml-service:1.0
```

## Model Architecture

### Random Forest Classifier
- **Estimators**: 100 decision trees
- **Dataset**: Iris Flower Dataset
- **Training**: Automatic at startup
- **Accuracy**: ~97% on test data
- **Inference**: < 1ms per prediction

### Input Features
```
Index | Name                 | Min  | Max  | Mean
0     | Sepal Length (cm)    | 4.3  | 7.9  | 5.8
1     | Sepal Width (cm)     | 2.0  | 4.4  | 3.0
2     | Petal Length (cm)    | 1.0  | 6.9  | 3.8
3     | Petal Width (cm)     | 0.1  | 2.5  | 1.2
```

### Output Classes
```
ID | Name         | Example Features (approx)
0  | setosa       | [5.0, 3.5, 1.5, 0.2]
1  | versicolor   | [6.5, 3.0, 5.5, 1.8]
2  | virginica    | [7.5, 3.0, 6.5, 2.0]
```

## Performance Benchmarks

```
Single Prediction: < 1ms
Batch (100 samples): < 50ms
Batch (1000 samples): < 200ms
Memory footprint: ~150-200 MB per pod
CPU usage: 50-100m (per pod at idle)
```

## Troubleshooting

### Pod Not Starting

```bash
# Check pod status
kubectl describe pod ml-service-deployment-xxxx

# View logs
kubectl logs ml-service-deployment-xxxx

# Check events
kubectl get events --sort-by='.lastTimestamp' | tail -20
```

### Connection Refused

```bash
# Verify service is running
kubectl get pods -l app=ml-service

# Check service endpoints
kubectl get endpoints ml-service

# Verify port forwarding
kubectl port-forward svc/ml-service 5000:5000

# Test connectivity
curl http://localhost:5000/health
```

### Model Loading Error

```bash
# Check pod logs for specific error
kubectl logs <pod-name> | grep -i error

# Check Python version compatibility
kubectl exec <pod-name> -- python --version

# Check dependencies
kubectl exec <pod-name> -- pip list
```

## Complete Workflow Summary

```bash
# 1. Start Minikube
minikube start --driver=docker

# 2. Configure Docker
eval $(minikube docker-env)

# 3. Build image
docker build -t curiousgaurav-ml-service:1.0 .

# 4. Deploy
kubectl apply -f ml-service-deployment.yaml

# 5. Port forward
kubectl port-forward svc/ml-service 5000:5000 &

# 6. Test prediction
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"features": [5.1, 3.5, 1.4, 0.2]}'

# 7. View results in response
# Check prediction and confidence score

# 8. Cleanup
kubectl delete -f ml-service-deployment.yaml
```

---

**Next**: Try different flower measurements and observe predictions!

## Example Predictions

**Setosa (Small, early flowering)**
```
Features: [5.1, 3.5, 1.4, 0.2]
Prediction: setosa
Confidence: 99%
```

**Versicolor (Medium, mid-season)**
```
Features: [7.0, 3.2, 4.7, 1.4]
Prediction: versicolor
Confidence: 98%
```

**Virginica (Large, late flowering)**
```
Features: [6.3, 3.3, 6.0, 2.5]
Prediction: virginica
Confidence: 97%
```

Test with your own measurements and see how the model predicts!
