# Minikube & kubectl Commands Reference

## Minikube Cluster Management

### Starting & Stopping

```bash
# Start cluster with Docker driver
minikube start --driver=docker

# Start with custom resources
minikube start --cpus=4 --memory=8192 --disk-size=30g --driver=docker

# Start with specific Kubernetes version
minikube start --kubernetes-version=v1.28.0

# Stop cluster (without deletion)
minikube stop

# Restart cluster
minikube start

# Delete cluster completely
minikube delete

# Delete all profiles/clusters
minikube delete --all

# Pause cluster (freeze resources)
minikube pause

# Unpause cluster
minikube unpause
```

### Status & Information

```bash
# Check cluster status
minikube status

# Get detailed JSON status
minikube status --output=json

# View Minikube configuration
minikube config view

# Get cluster info
kubectl cluster-info

# Get nodes information
kubectl get nodes -o wide

# Describe node
kubectl describe node minikube
```

### Configuration Management

```bash
# Set CPU cores
minikube config set cpus 4

# Set RAM (in MB)
minikube config set memory 8192

# Set disk size
minikube config set disk-size 30g

# View all config settings
minikube config view

# Get a specific config value
minikube config get cpus

# Unset a config value
minikube config unset cpus
```

## Docker Integration

### Using Minikube Docker Daemon

```bash
# Get Docker environment variables
minikube docker-env

# Configure current shell to use Minikube Docker
# Linux/macOS:
eval $(minikube docker-env)

# Windows PowerShell:
minikube docker-env | Invoke-Expression

# List images in Minikube
docker images

# Build image in Minikube (after eval/Invoke-Expression)
docker build -t my-app:1.0 .

# This image is immediately available in Minikube
kubectl run test --image=my-app:1.0
```

### Image Management

```bash
# Build and automatically load into Minikube
minikube image build -t my-app:1.0 .

# Load local image into Minikube
minikube image load my-image:1.0

# List images in Minikube
minikube image ls

# Delete image from Minikube
minikube image rm my-app:1.0

# Push image to registry
minikube image push your-registry/my-app:1.0
```

## Kubernetes (kubectl) Commands

### Pod Management

```bash
# List all pods in current namespace
kubectl get pods

# List pods with details
kubectl get pods -o wide

# List pods in all namespaces
kubectl get pods --all-namespaces
kubectl get pods -A

# Get specific pod
kubectl get pod pod-name

# Watch pod status in real-time
kubectl get pods -w

# Describe pod (detailed info)
kubectl describe pod pod-name

# Get pod YAML
kubectl get pod pod-name -o yaml

# Get pod details in JSON
kubectl get pod pod-name -o json
```

### Pod Operations

```bash
# Run pod directly
kubectl run my-pod --image=nginx:latest

# Run pod with environment variables
kubectl run my-pod --image=nginx --env="VAR1=value1"

# Execute command in pod
kubectl exec pod-name -- ls -la

# Execute interactive shell
kubectl exec -it pod-name -- /bin/bash

# Get pod logs
kubectl logs pod-name

# Follow logs in real-time
kubectl logs -f pod-name

# Get logs from previous pod (if crashed)
kubectl logs pod-name --previous

# Delete pod
kubectl delete pod pod-name

# Delete multiple pods
kubectl delete pod pod1 pod2 pod3

# Delete all pods in namespace
kubectl delete pods --all
```

## Deployment Management

### Creating & Listing Deployments

```bash
# Apply deployment from YAML file
kubectl apply -f deployment.yaml

# Create deployment from command
kubectl create deployment my-app --image=my-app:1.0

# List deployments
kubectl get deployments

# Get deployment with detailed info
kubectl get deployment deployment-name -o wide

# Describe deployment
kubectl describe deployment deployment-name

# Delete deployment
kubectl delete deployment deployment-name
```

### Deployment Operations

```bash
# Scale deployment to N replicas
kubectl scale deployment my-app --replicas=5

# Check rollout status
kubectl rollout status deployment/my-app

# View rollout history
kubectl rollout history deployment/my-app

# Undo last deployment
kubectl rollout undo deployment/my-app

# Undo to specific revision
kubectl rollout undo deployment/my-app --to-revision=2

# Get deployment YAML
kubectl get deployment deployment-name -o yaml

# Edit deployment
kubectl edit deployment deployment-name

# Update image
kubectl set image deployment/my-app app=my-app:2.0

# Update replica count
kubectl set replicas deployment/my-app --replicas=3
```

## Service Management

### Creating Services

```bash
# Create service for deployment
kubectl expose deployment my-app --type=ClusterIP --port=8080

# Create LoadBalancer service
kubectl expose deployment my-app --type=LoadBalancer --port=80 --target-port=8080

# Create service from YAML
kubectl apply -f service.yaml

# List services
kubectl get services

# Get service details
kubectl get svc service-name -o wide

# Describe service
kubectl describe svc service-name

# Get service YAML
kubectl get svc service-name -o yaml

# Delete service
kubectl delete svc service-name
```

### Accessing Services

```bash
# Forward local port to service
kubectl port-forward svc/service-name 8080:80

# Forward pod port
kubectl port-forward pod/pod-name 8080:8080

# Get service IP
kubectl get svc service-name -o jsonpath='{.spec.clusterIP}'

# Access service from pod
kubectl run -it test-pod --image=curl --rm -- curl http://service-name
```

## Namespace Management

```bash
# List namespaces
kubectl get namespaces

# Create namespace
kubectl create namespace my-namespace

# Set default namespace
kubectl config set-context --current --namespace=my-namespace

# Get current namespace
kubectl config view --minify | grep namespace

# Get resources in specific namespace
kubectl get pods -n my-namespace

# Delete namespace
kubectl delete namespace my-namespace
```

## Configuration & Secrets

### ConfigMaps

```bash
# Create ConfigMap from literals
kubectl create configmap my-config --from-literal=KEY1=value1 --from-literal=KEY2=value2

# Create ConfigMap from file
kubectl create configmap my-config --from-file=config.txt

# List ConfigMaps
kubectl get configmaps

# Get ConfigMap
kubectl get configmap my-config

# Describe ConfigMap
kubectl describe configmap my-config

# Delete ConfigMap
kubectl delete configmap my-config
```

### Secrets

```bash
# Create secret from literals
kubectl create secret generic my-secret --from-literal=username=admin --from-literal=password=secure

# Create secret from file
kubectl create secret generic my-secret --from-file=secret.txt

# List secrets
kubectl get secrets

# Get secret (values are base64 encoded)
kubectl get secret my-secret -o yaml

# Delete secret
kubectl delete secret my-secret
```

## Debugging & Monitoring

### Logs & Events

```bash
# Get pod logs
kubectl logs pod-name

# Get logs from previous pod instance
kubectl logs pod-name --previous

# Get container logs from pod with multiple containers
kubectl logs pod-name -c container-name

# Stream logs in real-time
kubectl logs -f pod-name

# Get events
kubectl get events

# Get events sorted by time
kubectl get events --sort-by='.lastTimestamp'

# Describe pod for event details
kubectl describe pod pod-name
```

### Resource Monitoring

```bash
# Get resource usage (requires metrics-server add-on)
kubectl top nodes

# Get pod resource usage
kubectl top pods

# Get resource usage in all namespaces
kubectl top pods --all-namespaces

# Enable metrics (if not enabled)
minikube addons enable metrics-server

# Check if metrics-server is running
kubectl get deployment metrics-server -n kube-system
```

### Troubleshooting

```bash
# Execute command in pod
kubectl exec pod-name -- command

# Interactive bash in pod
kubectl exec -it pod-name -- /bin/bash

# Copy files from pod
kubectl cp pod-name:/path/to/file ./local-file

# Copy files to pod
kubectl cp ./local-file pod-name:/path/to/file

# Describe pod (shows events and errors)
kubectl describe pod pod-name

# Get pod YAML for debugging
kubectl get pod pod-name -o yaml

# Check API server logs (master node)
kubectl logs -n kube-system deployment/kube-apiserver

# Check kubelet logs
minikube logs
```

## YAML & Manifests

```bash
# Apply YAML file
kubectl apply -f file.yaml

# Apply all YAML files in directory
kubectl apply -f directory/

# Create resource from YAML (fails if exists)
kubectl create -f file.yaml

# Delete resources from YAML
kubectl delete -f file.yaml

# Get resource as YAML
kubectl get pod pod-name -o yaml

# Get resource as JSON
kubectl get pod pod-name -o json

# Validate YAML syntax
kubectl apply -f file.yaml --dry-run=client

# Check what would change
kubectl diff -f file.yaml

# Apply with dry-run (no actual changes)
kubectl apply -f file.yaml --dry-run=client -o yaml
```

## Minikube Addons

```bash
# List all available addons
minikube addons list

# Enable addon
minikube addons enable dashboard
minikube addons enable metrics-server
minikube addons enable ingress

# Disable addon
minikube addons disable addon-name

# Common addons:
minikube addons enable metrics-server      # Resource metrics
minikube addons enable dashboard           # Kubernetes Dashboard
minikube addons enable ingress             # Ingress controller
minikube addons enable registry            # Container registry
minikube addons enable storage-provisioner # Storage provisioning
```

## Minikube Networking

```bash
# Get Minikube IP
minikube ip

# Access service from host
# 1. Get service NodePort
kubectl get svc service-name

# 2. Access via minikube ip and port
curl http://$(minikube ip):32000

# Or use port-forward
kubectl port-forward svc/service-name 8080:80
curl http://localhost:8080

# SSH into Minikube
minikube ssh

# SSH and run command
minikube ssh -- docker ps

# Access Minikube API
MINIKUBE_IP=$(minikube ip)
curl http://$MINIKUBE_IP:8443
```

## Context & Configuration

```bash
# View current context
kubectl config current-context

# List all contexts
kubectl config get-contexts

# Switch context
kubectl config use-context minikube

# View kubeconfig
kubectl config view

# Get specific config value
kubectl config get-clusters

# Merge kubeconfigs
kubectl config use-context master

# Set namespace for current context
kubectl config set-context --current --namespace=default
```

## Useful Aliases

```bash
# Create aliases for common commands
alias k=kubectl
alias kg='kubectl get'
alias kd='kubectl describe'
alias kl='kubectl logs'
alias ke='kubectl exec -it'
alias ka='kubectl apply'
alias kdel='kubectl delete'
alias kgp='kubectl get pods'
alias kgd='kubectl get deployments'
alias kgs='kubectl get services'

# Run multiple commands
kubectl get pods && kubectl get services && kubectl get deployments
```

## Common Workflows

### Deploy Application

```bash
# 1. Build image
minikube image build -t my-app:1.0 .

# 2. Create deployment
kubectl create deployment my-app --image=my-app:1.0

# 3. Verify pods
kubectl get pods

# 4. Expose service
kubectl expose deployment my-app --type=LoadBalancer --port=80

# 5. Access application
kubectl port-forward svc/my-app 8080:80
# Access at http://localhost:8080
```

### Scale Application

```bash
# Get current deployment
kubectl get deployment my-app

# Scale to 5 replicas
kubectl scale deployment my-app --replicas=5

# Watch scaling
kubectl get pods -w

# Scale down
kubectl scale deployment my-app --replicas=1
```

### Update Application

```bash
# Change image
kubectl set image deployment/my-app app=my-app:2.0

# Monitor rollout
kubectl rollout status deployment/my-app

# Verify new version
kubectl get pods

# Rollback if needed
kubectl rollout undo deployment/my-app
```

### Debug Application

```bash
# 1. Check pod status
kubectl describe pod pod-name

# 2. View logs
kubectl logs pod-name

# 3. Execute command
kubectl exec pod-name -- env

# 4. Enter pod shell
kubectl exec -it pod-name -- /bin/bash

# 5. Check resources
kubectl top pods
```

## Performance Tips

```bash
# Get output faster (no formatting)
kubectl get pods -o name

# Use watch for real-time updates
kubectl get pods -w

# Batch operations
kubectl delete pod pod1 pod2 pod3

# Get multiple resource types at once
kubectl get pods,svc,deploy

# Use labels for filtering
kubectl get pods -l app=my-app

# Get pods with field selector
kubectl get pods --field-selector=status.phase=Running
```

## Emergency Commands

```bash
# Delete all resources in namespace
kubectl delete all --all -n default

# Force delete stuck pod
kubectl delete pod pod-name --grace-period=0 --force

# Clear stuck pod terminating state
kubectl patch pod pod-name -p '{"metadata":{"finalizers":null}}'

# Restart deployment
kubectl rollout restart deployment/my-app

# Scale to 0 (stop pods)
kubectl scale deployment my-app --replicas=0

# Scale back up
kubectl scale deployment my-app --replicas=1
```

---

**Next**: See [../task-2-kubernetes-deployment/](../task-2-kubernetes-deployment/) for practical deployment examples.
