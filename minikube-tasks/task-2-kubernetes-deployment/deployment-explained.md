# Kubernetes YAML Deployment Explained

## Complete YAML Structure Breakdown

### Part 1: Deployment Object

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: curiousgaurav-deployment
  namespace: default
  labels:
    app: web-server
    managed-by: kubernetes
    version: "1.0"
```

#### apiVersion
- **Value**: `apps/v1`
- **Meaning**: Kubernetes API version for Deployment resource
- **Evolution**: 
  - `v1beta1` - Early Kubernetes
  - `apps/v1beta1` - Intermediate
  - `apps/v1` - Current stable version (as of Kubernetes 1.16+)

#### kind
- **Value**: `Deployment`
- **Meaning**: Type of Kubernetes resource
- **Other kinds**: Pod, Service, ConfigMap, StatefulSet, DaemonSet, etc.

#### metadata
- **name**: Unique identifier for the deployment in the namespace
- **namespace**: Kubernetes namespace (default is "default")
- **labels**: Key-value pairs for organizing and selecting resources
  - Used by selectors and queries
  - Can organize by app, environment, team, version

### Part 2: Deployment Specification

```yaml
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
  selector:
    matchLabels:
      app: web-server
      tier: frontend
```

#### replicas
- **Value**: `3`
- **Meaning**: Number of pod copies Kubernetes creates
- **Behavior**: 
  - Maintains exactly 3 running pods
  - Creates new pods if any crash
  - Scales down if set to lower number

#### strategy
- **Type**: `RollingUpdate` (default)
- **Alternatives**: 
  - `Recreate` - Deletes old pods, then creates new ones
  
#### rollingUpdate Configuration
- **maxSurge**: 1 - Maximum additional pods beyond replicas (3+1=4 during update)
- **maxUnavailable**: 1 - Maximum pods that can be unavailable (can have minimum 2 running)
- **Purpose**: Zero-downtime deployments (no service interruption)

#### selector
- **matchLabels**: `app: web-server`, `tier: frontend`
- **Purpose**: Finds pods to manage
- **Matching**: Pods with EXACTLY these labels are controlled by this deployment
- **Important**: Pod template labels must match selector labels

### Part 3: Pod Template

```yaml
  template:
    metadata:
      labels:
        app: web-server
        tier: frontend
        version: "1.0"
    spec:
      restartPolicy: Always
```

#### template
- **Purpose**: Blueprint for creating pods
- **Structure**: Contains metadata and spec for pods

#### template.metadata.labels
- **Must match**: Deployment selector's matchLabels
- **Additional labels**: Can have extra labels beyond selector
- **Purpose**: Mark pods with identifying information

#### restartPolicy
- **Value**: `Always` (default)
- **Options**:
  - `Always` - Restart pod if it exits (any reason)
  - `OnFailure` - Restart only if exit code is non-zero
  - `Never` - Don't restart pods

### Part 4: Container Specification

```yaml
      containers:
      - name: nginx-container
        image: nginx:latest
        imagePullPolicy: IfNotPresent
        ports:
        - name: http
          containerPort: 80
          protocol: TCP
```

#### name
- **Value**: `nginx-container`
- **Purpose**: Identifies container within pod
- **Usage**: Used for logs, exec, port-forward

#### image
- **Value**: `nginx:latest`
- **Format**: `repository:tag`
- **Registry**: Defaults to Docker Hub if not specified
- **Alternatives**: `nginx:1.21`, `my-registry/nginx:latest`

#### imagePullPolicy
- **Value**: `IfNotPresent`
- **Options**:
  - `Always` - Always pull image (slower, ensures latest)
  - `IfNotPresent` - Use cached if available
  - `Never` - Use only cached image

#### ports
- **name**: Descriptive name for port mapping
- **containerPort**: Port application listens on (inside container)
- **protocol**: TCP (default) or UDP

### Part 5: Resource Management

```yaml
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 500m
            memory: 512Mi
```

#### requests
- **Purpose**: Guaranteed resources for pod
- **Scheduler**: Uses requests to place pods on nodes
- **cpu**: 100m = 0.1 CPU cores (m = millicores, 1000m = 1 core)
- **memory**: 128Mi = 128 Mebibytes (128M = Megabytes, 128Gi = Gibibytes)

#### limits
- **Purpose**: Maximum resources pod can consume
- **Enforcement**: Pod is killed if exceeds limits
- **cpu**: Throttled if exceeded
- **memory**: Pod killed (OOMKilled) if exceeded

#### Guidelines
```
Requests << Limits (2x to 5x)
Example: 
  requests: cpu=100m, memory=128Mi
  limits: cpu=500m, memory=512Mi
```

### Part 6: Probes (Health Checks)

```yaml
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 15
          periodSeconds: 20
          timeoutSeconds: 1
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 10
```

#### Liveness Probe
- **Purpose**: Is container healthy? (not stuck/zombie)
- **Failure**: Kubernetes restarts pod
- **Types**: httpGet, tcpSocket, exec, startup

#### Liveness Parameters
- **initialDelaySeconds**: 15 - Wait before first check
- **periodSeconds**: 20 - Check every 20 seconds
- **timeoutSeconds**: 1 - Response timeout
- **failureThreshold**: 3 - Restart after 3 failures

#### Readiness Probe
- **Purpose**: Is container ready to accept traffic?
- **Failure**: Pod removed from service (no traffic sent)
- **Difference**: Pod keeps running (vs restart on liveness failure)
- **Typical use**: Wait for startup, database connection

#### Readiness Parameters
- **initialDelaySeconds**: 5 - Start checking after 5 seconds
- **periodSeconds**: 10 - Check every 10 seconds

### Part 7: Environment Variables & Volumes

```yaml
        env:
        - name: APP_NAME
          value: "curiousgaurav-app"
        - name: ENVIRONMENT
          value: "development"
        volumeMounts:
        - name: html-volume
          mountPath: /usr/share/nginx/html
      volumes:
      - name: html-volume
        emptyDir: {}
```

#### env
- **name**: Environment variable name
- **value**: Environment variable value
- **Accessible**: Inside container via `$APP_NAME`
- **From ConfigMap**: Can reference ConfigMap
- **From Secret**: Can reference Secret

#### volumeMounts
- **name**: References volume defined at pod level
- **mountPath**: Where volume appears in container

#### volumes
- **emptyDir**: Temporary storage, deleted when pod terminates
- **Other types**: configMap, secret, persistentVolumeClaim, hostPath

### Part 8: Service Object

```yaml
---
apiVersion: v1
kind: Service
metadata:
  name: curiousgaurav-service
  labels:
    app: web-server
spec:
  type: NodePort
  selector:
    app: web-server
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
    nodePort: 30080
```

#### Service Purpose
- **Stable network interface** for pods
- **Pods are ephemeral**: May be replaced, so IP changes
- **Service provides**: Consistent IP and DNS name

#### Service Type
- **NodePort**: Exposes on each node's IP + port (30000-32767)
- **ClusterIP**: Internal only (default)
- **LoadBalancer**: Cloud provider load balancer
- **ExternalName**: DNS CNAME reference

#### Service Port Mapping
- **port**: 80 - Service IP port (internal)
- **targetPort**: 80 - Pod container port
- **nodePort**: 30080 - Node port (access from outside)

#### Hostname
- **Internal**: `curiousgaurav-service.default.svc.cluster.local`
- **Short**: `curiousgaurav-service` (same namespace)

## Complete Workflow

### 1. Deployment Creation
```
User creates deployment.yaml
↓
Kubernetes API accepts deployment
↓
Deployment controller creates ReplicaSet
↓
ReplicaSet controller creates 3 Pods
↓
Each Pod starts nginx container
```

### 2. Pod Lifecycle
```
Pod Created
↓
Container started (initialDelaySeconds=5)
↓
Readiness probe checks (periodSeconds=10)
↓
Pod added to Service endpoints (traffic sent)
↓
Liveness probe checks (periodSeconds=20)
↓
Pod running, serving traffic
```

### 3. Pod Failure Recovery
```
Container crashes (exit code)
↓
Liveness probe fails 3 times
↓
Kubernetes restarts container
↓
Pod IP remains same (pod reused)
↓
Service automatically routes to new pod
```

### 4. Deployment Update
```
New image deployed (kubectl set image)
↓
Rolling update strategy engages
↓
Create 1 new pod (maxSurge=1)
↓
Old pod becomes unready
↓
Old pod deleted
↓
Repeat until all 3 pods updated
↓
Zero downtime achieved
```

## Common Modifications

### Increase Replicas
```yaml
replicas: 5  # Was 3
```

### Change Image
```yaml
image: nginx:1.21  # From nginx:latest
```

### Add Resource Limits
```yaml
resources:
  requests:
    cpu: 200m
    memory: 256Mi
  limits:
    cpu: 1000m
    memory: 1Gi
```

### Change Service Type
```yaml
type: LoadBalancer  # From NodePort (needs cloud provider)
```

### Add Port
```yaml
ports:
- name: http
  containerPort: 80
- name: https
  containerPort: 443
```

## Validation Checklist

- [ ] `apiVersion: apps/v1` - Correct API version
- [ ] `kind: Deployment` - Correct resource type
- [ ] `metadata.name` - Unique name
- [ ] `spec.selector.matchLabels` - Matches template labels
- [ ] `spec.template.metadata.labels` - Contains selector labels
- [ ] `spec.containers[].name` - Container has name
- [ ] `spec.containers[].image` - Container has image
- [ ] `spec.containers[].ports` - Listening ports defined
- [ ] Labels consistent - No typos

## Best Practices

1. **Always set requests and limits** - For proper scheduling
2. **Use liveness AND readiness probes** - For reliability
3. **Set meaningful labels** - For organization and selection
4. **Use specific image tags** - Never rely on `latest`
5. **Define rolling update strategy** - For zero downtime
6. **Set restart policy** - Usually `Always`
7. **Use descriptive names** - `app-name`, not `deployment1`
8. **Include version in labels** - Track deployments over time

---

**Next**: See [DEPLOYMENT_COMMANDS.md](./DEPLOYMENT_COMMANDS.md) for practical commands to deploy this.
