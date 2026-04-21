# Deployment Guide

## Deployment Overview

This guide covers deploying the AlMuthannaPrecast Inventory Management System to production.

## Table of Contents
1. [Docker Deployment](#docker-deployment)
2. [Docker Compose Deployment](#docker-compose-deployment)
3. [Environment Configuration](#environment-configuration)
4. [Scaling Considerations](#scaling-considerations)
5. [Monitoring & Logging](#monitoring--logging)
6. [Troubleshooting](#troubleshooting)

---

## Docker Deployment

### Building the Docker Image

```bash
# Build the production image
docker build -t inventory-app:latest .

# Optionally tag with version
docker build -t inventory-app:1.0.0 .

# Build and tag for registry
docker build -t myregistry.azurecr.io/inventory-app:latest .
```

### Running with Docker

```bash
# Basic run
docker run -p 80:80 \
  -e VITE_API_BASE_URL=https://api.example.com \
  inventory-app:latest

# With volume mount for logs (optional)
docker run -p 80:80 \
  -e VITE_API_BASE_URL=https://api.example.com \
  -v /var/log/inventory-app:/var/log/nginx \
  inventory-app:latest

# With custom name
docker run -d \
  --name inventory-prod \
  -p 80:80 \
  -e VITE_API_BASE_URL=https://api.example.com \
  inventory-app:latest
```

### Verifying the Deployment

```bash
# Check container is running
docker ps | grep inventory-app

# View logs
docker logs inventory-prod

# Test health endpoint
curl http://localhost/health

# View container stats
docker stats inventory-prod
```

---

## Docker Compose Deployment

### Production Deployment with Docker Compose

```bash
# Copy production compose file
cp docker-compose.prod.yml docker-compose.yml

# Create .env file with production settings
cat > .env << EOF
VITE_API_BASE_URL=https://api.example.com
EOF

# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Advanced: Multiple Replicas

```bash
# Scale to multiple instances (requires load balancer)
docker-compose up -d --scale app=3
```

---

## Environment Configuration

### Environment Variables

#### Required Variables
- `VITE_API_BASE_URL`: The base URL of your API server

#### Optional Variables
- `VITE_APP_NAME`: Application name (default: AlMuthannaPrecast Inventory Management)
- `VITE_APP_VERSION`: Application version (default: 1.0.0)
- `NODE_ENV`: Should be `production` (automatically set in Dockerfile)

### Setting Environment Variables

#### Method 1: Docker Command
```bash
docker run -e VITE_API_BASE_URL=https://api.example.com inventory-app:latest
```

#### Method 2: .env File with Docker Compose
```bash
# Create .env file
VITE_API_BASE_URL=https://api.example.com

# Use in docker-compose
docker-compose up -d
```

#### Method 3: Environment File
```bash
docker run --env-file production.env inventory-app:latest
```

### Example Production .env File
```
# production.env
VITE_API_BASE_URL=https://api.almuthanna.com
NODE_ENV=production
```

---

## Cloud Deployment

### Azure Container Instances (ACI)

```bash
# Create container instance
az container create \
  --resource-group myResourceGroup \
  --name inventory-app \
  --image inventory-app:latest \
  --cpu 1 --memory 1 \
  --environment-variables \
    VITE_API_BASE_URL=https://api.example.com \
  --ports 80 \
  --dns-name-label inventory-app
```

### AWS Elastic Container Service (ECS)

```bash
# Push image to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

docker tag inventory-app:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/inventory-app:latest

docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/inventory-app:latest

# Create ECS task definition and service (via AWS Console or CLI)
```

### Kubernetes (K8s) Deployment

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: inventory-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: inventory-app
  template:
    metadata:
      labels:
        app: inventory-app
    spec:
      containers:
      - name: inventory-app
        image: inventory-app:latest
        ports:
        - containerPort: 80
        env:
        - name: VITE_API_BASE_URL
          value: "https://api.example.com"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: inventory-app-service
spec:
  selector:
    app: inventory-app
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: LoadBalancer
```

```bash
# Deploy to Kubernetes
kubectl apply -f deployment.yaml

# Check deployment
kubectl get deployments
kubectl get pods
kubectl get services
```

---

## HTTPS/SSL Configuration

### Using Nginx Reverse Proxy

```yaml
# docker-compose with Nginx reverse proxy
version: '3.8'

services:
  app:
    build: .
    container_name: inventory-app
    networks:
      - inventory-network

  nginx:
    image: nginx:alpine
    container_name: inventory-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx-reverse-proxy.conf:/etc/nginx/nginx.conf:ro
      - ./certs:/etc/nginx/certs:ro
    depends_on:
      - app
    networks:
      - inventory-network

networks:
  inventory-network:
    driver: bridge
```

### Let's Encrypt with Certbot

```bash
# Get SSL certificate
certbot certonly --standalone -d yourdomain.com

# Certificate location: /etc/letsencrypt/live/yourdomain.com/

# Mount in Docker
docker run -v /etc/letsencrypt:/etc/nginx/certs inventory-app:latest
```

---

## Scaling Considerations

### Single Instance
- Docker container runs on single machine
- Good for small to medium deployments
- Max ~100 concurrent users

### Multiple Instances (with Load Balancer)
```bash
# Load balance across containers
docker-compose up --scale app=3

# Use load balancer (Nginx, HAProxy, Cloud LB)
```

### Container Orchestration (Kubernetes, Docker Swarm)
- Auto-scaling based on CPU/memory
- Self-healing and rolling updates
- Good for large deployments

---

## Monitoring & Logging

### Container Logs
```bash
# View application logs
docker logs inventory-prod

# Follow logs in real-time
docker logs -f inventory-prod

# Last 100 lines
docker logs --tail 100 inventory-prod
```

### Health Checks
```bash
# Test health endpoint
curl http://localhost/health

# Expected response: 200 OK with "healthy"
```

### Resource Monitoring
```bash
# Monitor container resources
docker stats inventory-prod

# Check container details
docker inspect inventory-prod
```

### Centralized Logging (Optional)
```yaml
# Send logs to external service
version: '3.8'
services:
  app:
    build: .
    logging:
      driver: "splunk"
      options:
        splunk-token: "YOUR-TOKEN"
        splunk-url: "https://your-splunk-instance:8088"
```

---

## Performance Optimization

### Image Optimization
```bash
# Multi-stage build reduces image size
# Already implemented in Dockerfile

# Check image size
docker images inventory-app

# Typical size: ~25-30 MB
```

### Runtime Optimization
```bash
# Enable gzip compression (in nginx.conf)
gzip on;
gzip_min_length 1000;

# Cache static assets (1 year)
expires 1y;
```

### Caching Strategy
- Static assets: 1 year cache
- HTML (index.html): Must-revalidate
- API responses: Depends on backend

---

## Security Hardening

### Docker Security
```bash
# Run as non-root user (Nginx runs as nginx user)
# Already configured in Dockerfile

# Security headers in nginx.conf:
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
```

### Network Security
```bash
# Use Docker networks (not exposed to host)
docker network create inventory-network
docker run --network inventory-network inventory-app

# Firewall rules for production
# Only expose ports 80/443
# Restrict API access by IP if possible
```

---

## Backup & Recovery

### Database Persistence (if needed)
```bash
# Create named volume for database
docker volume create inventory-db-volume

# Mount in container
docker run -v inventory-db-volume:/data inventory-app
```

### Configuration Backup
```bash
# Backup .env files
tar -czf config-backup.tar.gz .env .env.production

# Store securely (not in git)
```

---

## Troubleshooting

### Container Won't Start
```bash
# Check logs
docker logs inventory-prod

# Common issues:
# 1. Port already in use: docker ps, kill process
# 2. Missing environment variables: Check .env file
# 3. Image build failed: docker build -t inventory-app .
```

### Slow Performance
```bash
# Check container resources
docker stats inventory-prod

# Solutions:
# 1. Increase memory limit
# 2. Check API response times
# 3. Enable gzip compression
```

### API Connection Issues
```bash
# Test API connectivity
curl -v https://api.example.com/api/items

# Check environment variable
docker exec inventory-prod sh -c 'echo $VITE_API_BASE_URL'

# Update if needed:
docker stop inventory-prod
docker run -e VITE_API_BASE_URL=https://new-api.com inventory-app
```

### Database/Data Issues
```bash
# Check mounted volumes
docker inspect inventory-prod | grep -A 5 Mounts

# Backup data before updates
docker cp inventory-prod:/data ./backup
```

---

## Deployment Checklist

- [ ] API server is running and accessible
- [ ] Environment variables configured (.env file created)
- [ ] Docker image built successfully
- [ ] Container starts without errors
- [ ] Health endpoint returns 200 OK
- [ ] Application loads in browser
- [ ] Can connect to API from application
- [ ] HTTPS/SSL configured (if required)
- [ ] Monitoring and logging set up
- [ ] Backup strategy in place
- [ ] Security hardening applied
- [ ] Documentation updated

---

## Rollback Procedure

```bash
# If deployment fails, rollback to previous version

# Stop current container
docker-compose down

# Remove current image
docker rmi inventory-app:latest

# Use previous tag
docker tag inventory-app:1.0.0-previous inventory-app:latest

# Restart with previous version
docker-compose up -d
```

---

## Support & Documentation

- **Setup**: See SETUP.md
- **Development**: See SETUP.md for development guidelines
- **Code Review**: See CODE_REVIEW_AND_IMPLEMENTATION_PLAN.md
- **API Documentation**: See v1.json (OpenAPI spec)

---

**Last Updated**: April 21, 2026  
**Version**: 1.0.0  
**Status**: Ready for Production Deployment
