---
sidebar_position: 1
title: "Deployment Overview"
description: "Comprehensive guide to deploying the ÉquiSettle platform across different environments"
---

# Deployment Overview

The ÉquiSettle platform is designed for flexible deployment across multiple environments, from development to enterprise-scale production. This guide covers the complete deployment architecture, strategies, and best practices.

## Deployment Architecture

### High-Level Infrastructure

```mermaid
graph TB
    subgraph "Frontend (Vercel/CDN)"
        CDN[CDN Edge Locations]
        Frontend[React Application]
        Static[Static Assets]
    end

    subgraph "Backend (AWS/Cloud)"
        LB[Load Balancer]
        API1[API Server 1]
        API2[API Server 2]
        API3[API Server N]
    end

    subgraph "Data Layer"
        MongoDB[(MongoDB Atlas)]
        Redis[(Redis Cloud)]
        S3[File Storage]
    end

    subgraph "External Services"
        QB[QuickBooks]
        Zoho[Zoho APIs]
        Stripe[Payment Gateways]
        Email[Email Services]
    end

    CDN --> Frontend
    Frontend --> LB
    LB --> API1
    LB --> API2
    LB --> API3
    API1 --> MongoDB
    API1 --> Redis
    API1 --> S3
    API1 --> QB
    API1 --> Zoho
    API1 --> Stripe
    API1 --> Email
```

## Environment Strategy

### Environment Tiers

| Environment | Purpose | Infrastructure | Data | Integrations |
|-------------|---------|----------------|------|--------------|
| **Development** | Local development | Local services | Local/Test DB | Sandbox APIs |
| **Staging** | Pre-production testing | Cloud (scaled down) | Staging DB | Test/Sandbox APIs |
| **Production** | Live application | Full cloud infrastructure | Production DB | Live APIs |
| **Demo** | Customer demonstrations | Cloud (shared) | Demo data | Sandbox APIs |

### Environment Configuration

#### Development Environment
```yaml
# docker-compose.dev.yml
version: '3.8'
services:
  backend:
    build: ./eqs-platform-be
    ports:
      - "8000:8000"
    environment:
      - NODE_ENV=development
      - MONGODB_URL=mongodb://mongo:27017/equisettle-dev
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mongo
      - redis
    volumes:
      - ./eqs-platform-be:/app
      - /app/node_modules

  frontend:
    build: ./eqs-platform-fe
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://localhost:8000
      - VITE_ENV=development
    volumes:
      - ./eqs-platform-fe:/app
      - /app/node_modules

  mongo:
    image: mongo:6.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  mongo_data:
```

#### Staging Environment
```yaml
# staging deployment configuration
apiVersion: apps/v1
kind: Deployment
metadata:
  name: equisettle-backend-staging
spec:
  replicas: 2
  selector:
    matchLabels:
      app: equisettle-backend-staging
  template:
    metadata:
      labels:
        app: equisettle-backend-staging
    spec:
      containers:
      - name: backend
        image: equisettle/backend:staging-latest
        ports:
        - containerPort: 8000
        env:
        - name: NODE_ENV
          value: "staging"
        - name: MONGODB_URL
          valueFrom:
            secretKeyRef:
              name: staging-secrets
              key: mongodb-url
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
```

#### Production Environment
```yaml
# production deployment with high availability
apiVersion: apps/v1
kind: Deployment
metadata:
  name: equisettle-backend-production
spec:
  replicas: 5
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 2
      maxUnavailable: 1
  selector:
    matchLabels:
      app: equisettle-backend-production
  template:
    metadata:
      labels:
        app: equisettle-backend-production
    spec:
      containers:
      - name: backend
        image: equisettle/backend:v1.2.3
        ports:
        - containerPort: 8000
        env:
        - name: NODE_ENV
          value: "production"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5
        resources:
          requests:
            memory: "1Gi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "1000m"
```

## Platform Components

### Backend Deployment

#### Container Configuration
```dockerfile
# Dockerfile for backend
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS runtime

RUN addgroup -g 1001 -S nodejs
RUN adduser -S backend -u 1001

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --chown=backend:nodejs . .

USER backend

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

CMD ["node", "src/app.js"]
```

#### Environment Variables Management
```bash
# Production environment variables
# Database
MONGODB_URL=mongodb+srv://user:pass@cluster.mongodb.net/equisettle
REDIS_URL=rediss://user:pass@redis-cluster.upstash.io:6380

# Application
NODE_ENV=production
PORT=8000
JWT_SECRET=${VAULT_JWT_SECRET}
SESSION_SECRET=${VAULT_SESSION_SECRET}

# Integrations
QUICKBOOKS_CLIENT_ID=${VAULT_QB_CLIENT_ID}
QUICKBOOKS_CLIENT_SECRET=${VAULT_QB_CLIENT_SECRET}
ZOHO_CLIENT_ID=${VAULT_ZOHO_CLIENT_ID}
ZOHO_CLIENT_SECRET=${VAULT_ZOHO_CLIENT_SECRET}

# Monitoring
LOG_LEVEL=info
PERFORMANCE_MONITORING=true
```

### Frontend Deployment

#### Build Configuration
```javascript
// vite.config.production.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@heroicons/react'],
          charts: ['recharts', 'framer-motion'],
          forms: ['react-hook-form', 'yup']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  define: {
    'process.env.NODE_ENV': '"production"',
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
    'process.env.VITE_APP_VERSION': JSON.stringify(process.env.npm_package_version)
  }
});
```

#### Vercel Configuration
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/assets/(.*)",
      "headers": {
        "cache-control": "public, max-age=31536000, immutable"
      }
    },
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_API_URL": "@api-url",
    "VITE_APP_NAME": "ÉquiSettle",
    "VITE_APP_VERSION": "@app-version"
  },
  "build": {
    "env": {
      "VITE_API_URL": "@api-url-build"
    }
  }
}
```

## Database Deployment

### MongoDB Atlas Configuration

#### Cluster Setup
```javascript
// MongoDB connection with production settings
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferMaxEntries: 0,
      bufferCommands: false,
    };

    if (process.env.NODE_ENV === 'production') {
      options.ssl = true;
      options.sslValidate = true;
      options.retryWrites = true;
      options.w = 'majority';
    }

    await mongoose.connect(process.env.MONGODB_URL, options);
    console.log('MongoDB connected successfully');

  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
```

#### Database Indexing Strategy
```javascript
// Production indexes for performance
const createIndexes = async () => {
  // Core collections indexes
  await db.collection('companies').createIndex({ email: 1 }, { unique: true });
  await db.collection('csvmappings').createIndex({ companyAccount: 1, name: 1 });
  await db.collection('csvmappings').createIndex({ companyAccount: 1, status: 1 });
  await db.collection('invoices').createIndex({ company: 1, status: 1 });
  await db.collection('invoices').createIndex({ company: 1, dueDate: 1 });

  // Performance indexes
  await db.collection('csvmappings').createIndex({
    companyAccount: 1,
    "followups.status": 1,
    "followups.reminderDateTime": 1
  });

  // Text search indexes
  await db.collection('csvmappings').createIndex({
    name: "text",
    "companyDetails.name": "text",
    email: "text"
  });
};
```

### Redis Deployment

#### Redis Cloud Configuration
```javascript
// Redis connection with clustering support
const Redis = require('ioredis');

const redis = new Redis.Cluster([
  {
    host: process.env.REDIS_HOST_1,
    port: process.env.REDIS_PORT_1,
  },
  {
    host: process.env.REDIS_HOST_2,
    port: process.env.REDIS_PORT_2,
  }
], {
  redisOptions: {
    password: process.env.REDIS_PASSWORD,
    tls: process.env.NODE_ENV === 'production' ? {} : undefined,
  },
  enableOfflineQueue: false,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
});

redis.on('connect', () => {
  console.log('Redis cluster connected');
});

redis.on('error', (error) => {
  console.error('Redis cluster error:', error);
});
```

## Security Configuration

### SSL/TLS Setup

#### Certificate Management
```yaml
# Kubernetes TLS configuration
apiVersion: v1
kind: Secret
metadata:
  name: equisettle-tls
type: kubernetes.io/tls
data:
  tls.crt: LS0tLS1CRUdJTi... # base64 encoded certificate
  tls.key: LS0tLS1CRUdJTi... # base64 encoded private key

---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: equisettle-ingress
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - api.equisettle.com
    secretName: equisettle-tls
  rules:
  - host: api.equisettle.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: equisettle-backend
            port:
              number: 8000
```

### Environment Secrets Management

#### Kubernetes Secrets
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: equisettle-secrets
type: Opaque
stringData:
  mongodb-url: "mongodb+srv://..."
  jwt-secret: "super-secret-jwt-key"
  quickbooks-client-secret: "qb-secret"
  stripe-secret-key: "sk_live_..."
```

#### Vault Integration
```javascript
// HashiCorp Vault integration
const vault = require('node-vault')({
  apiVersion: 'v1',
  endpoint: process.env.VAULT_ENDPOINT,
  token: process.env.VAULT_TOKEN
});

const getSecrets = async () => {
  try {
    const result = await vault.read('secret/data/equisettle/production');
    return result.data.data;
  } catch (error) {
    console.error('Failed to retrieve secrets from Vault:', error);
    throw error;
  }
};
```

## Monitoring and Observability

### Health Checks

#### Application Health Endpoints
```javascript
// Comprehensive health check
app.get('/health', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION,
    uptime: process.uptime(),
    services: {}
  };

  try {
    // Database health
    await mongoose.connection.db.admin().ping();
    health.services.database = 'healthy';
  } catch (error) {
    health.services.database = 'unhealthy';
    health.status = 'unhealthy';
  }

  try {
    // Redis health
    await redis.ping();
    health.services.redis = 'healthy';
  } catch (error) {
    health.services.redis = 'unhealthy';
    health.status = 'degraded';
  }

  // Memory usage
  const memUsage = process.memoryUsage();
  health.memory = {
    rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
    heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
    heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`
  };

  const statusCode = health.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(health);
});
```

#### Kubernetes Probes
```yaml
# Liveness and readiness probes
livenessProbe:
  httpGet:
    path: /health
    port: 8000
  initialDelaySeconds: 30
  periodSeconds: 10
  timeoutSeconds: 5
  successThreshold: 1
  failureThreshold: 3

readinessProbe:
  httpGet:
    path: /ready
    port: 8000
  initialDelaySeconds: 5
  periodSeconds: 5
  timeoutSeconds: 3
  successThreshold: 1
  failureThreshold: 3
```

### Logging Configuration

#### Structured Logging
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: 'equisettle-backend',
    version: process.env.APP_VERSION
  },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Production log aggregation
if (process.env.NODE_ENV === 'production') {
  logger.add(new winston.transports.Http({
    host: process.env.LOG_AGGREGATOR_HOST,
    port: process.env.LOG_AGGREGATOR_PORT,
    path: '/logs'
  }));
}
```

## Backup and Disaster Recovery

### Database Backup Strategy

#### Automated Backups
```bash
#!/bin/bash
# MongoDB backup script

BACKUP_DIR="/backups/mongodb"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="equisettle_backup_$DATE"

# Create backup
mongodump --uri="$MONGODB_URL" --out="$BACKUP_DIR/$BACKUP_NAME"

# Compress backup
tar -czf "$BACKUP_DIR/$BACKUP_NAME.tar.gz" -C "$BACKUP_DIR" "$BACKUP_NAME"

# Upload to cloud storage
aws s3 cp "$BACKUP_DIR/$BACKUP_NAME.tar.gz" "s3://equisettle-backups/mongodb/"

# Cleanup local backup
rm -rf "$BACKUP_DIR/$BACKUP_NAME"
rm "$BACKUP_DIR/$BACKUP_NAME.tar.gz"

# Retain only last 30 days of backups
aws s3 ls s3://equisettle-backups/mongodb/ | grep "equisettle_backup_" | sort | head -n -30 | awk '{print $4}' | xargs -I {} aws s3 rm s3://equisettle-backups/mongodb/{}
```

### Recovery Procedures

#### Database Recovery
```bash
# MongoDB restore procedure
BACKUP_FILE="equisettle_backup_20240101_120000.tar.gz"

# Download backup
aws s3 cp "s3://equisettle-backups/mongodb/$BACKUP_FILE" ./

# Extract backup
tar -xzf "$BACKUP_FILE"

# Restore database
mongorestore --uri="$MONGODB_URL" --drop "./equisettle_backup_20240101_120000"
```

## Performance Optimization

### Horizontal Scaling

#### Auto-scaling Configuration
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: equisettle-backend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: equisettle-backend
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### CDN Configuration

#### CloudFlare Setup
```javascript
// Cache optimization headers
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  } else if (req.path.startsWith('/assets/')) {
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
  }
  next();
});
```

## Deployment Checklist

### Pre-deployment Checklist
- [ ] **Environment Variables**: All required variables configured
- [ ] **Database Migrations**: Run pending migrations
- [ ] **Dependencies**: All dependencies installed and updated
- [ ] **Tests**: All tests passing (unit, integration, E2E)
- [ ] **Security Scan**: No critical vulnerabilities
- [ ] **Performance Tests**: Load testing completed
- [ ] **Backup**: Recent backup available
- [ ] **Monitoring**: Alerts and dashboards configured

### Post-deployment Checklist
- [ ] **Health Checks**: All services healthy
- [ ] **Smoke Tests**: Critical user journeys working
- [ ] **Integration Tests**: External APIs functioning
- [ ] **Performance Monitoring**: No performance degradation
- [ ] **Error Rates**: Error rates within acceptable limits
- [ ] **Log Monitoring**: No critical errors in logs
- [ ] **User Acceptance**: Key stakeholders notified

## Next Steps

### Detailed Deployment Guides
- **[Backend Deployment](./backend/aws-setup)** - Complete backend deployment guide
- **[Frontend Deployment](./frontend/vercel-setup)** - Frontend deployment and optimization
- **[Database Setup](./backend/database-setup)** - MongoDB and Redis configuration
- **[Monitoring Setup](./monitoring/logs)** - Comprehensive monitoring and alerting

### CI/CD Implementation
- **[GitHub Actions](./cicd/github-actions)** - Automated deployment pipelines
- **[Testing Automation](./cicd/automated-testing)** - Continuous testing strategies
- **[Rollback Procedures](./cicd/rollback-procedures)** - Safe deployment rollback

The ÉquiSettle platform deployment architecture provides enterprise-grade reliability, security, and scalability while maintaining operational simplicity and cost-effectiveness.