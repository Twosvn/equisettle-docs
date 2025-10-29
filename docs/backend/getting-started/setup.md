---
sidebar_position: 1
title: "Development Setup"
description: "Complete guide to setting up the ÉquiSettle backend development environment"
---

# Development Environment Setup

This guide will walk you through setting up a complete development environment for the ÉquiSettle backend platform.

## Prerequisites

### System Requirements
- **Operating System**: macOS, Linux, or Windows (with WSL2)
- **Memory**: Minimum 8GB RAM (16GB recommended)
- **Storage**: At least 10GB free space
- **Internet**: Stable connection for package downloads and API testing

### Required Software

#### 1. Node.js (v16+)
```bash
# Using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Verify installation
node --version  # Should show v18.x.x
npm --version   # Should show 9.x.x or higher
```

#### 2. MongoDB (v5.0+)
```bash
# macOS with Homebrew
brew tap mongodb/brew
brew install mongodb-community@6.0
brew services start mongodb/brew/mongodb-community

# Ubuntu/Debian
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod

# Verify installation
mongosh --eval "db.adminCommand('ping')"
```

#### 3. Redis (v6.0+)
```bash
# macOS with Homebrew
brew install redis
brew services start redis

# Ubuntu/Debian
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server

# Verify installation
redis-cli ping  # Should return "PONG"
```

#### 4. Git
```bash
# macOS with Homebrew
brew install git

# Ubuntu/Debian
sudo apt install git

# Configure Git
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Project Setup

### 1. Clone the Repository
```bash
# Clone the backend repository
git clone https://github.com/your-org/eqs-platform-be.git
cd eqs-platform-be

# Check out the development branch
git checkout develop
git pull origin develop
```

### 2. Install Dependencies
```bash
# Install all project dependencies
npm install

# Install development tools globally (optional)
npm install -g nodemon
npm install -g pm2
```

### 3. Environment Configuration
```bash
# Copy the example environment file
cp .env.example .env

# Edit the environment file with your settings
nano .env  # or use your preferred editor
```

### Required Environment Variables
```env
# Database Configuration
MONGODB_URL=mongodb://localhost:27017/equisettle-dev

# Redis Configuration
UPSTASH_REDIS_URL=redis://localhost:6379
UPSTASH_REDIS_TOKEN=your-redis-token

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-make-it-long-and-random

# Application Configuration
NODE_ENV=development
PORT=8000
FRONTEND_URL=http://localhost:3000

# Email Configuration (Gmail API)
GMAIL_CLIENT_ID=your-gmail-client-id
GMAIL_CLIENT_SECRET=your-gmail-client-secret
GMAIL_REFRESH_TOKEN=your-gmail-refresh-token

# Third-party Integration Tokens (for development)
QUICKBOOKS_CLIENT_ID=your-quickbooks-client-id
QUICKBOOKS_CLIENT_SECRET=your-quickbooks-client-secret
QUICKBOOKS_REDIRECT_URI=http://localhost:8000/api/v1/quickbooks/callback

# Additional integrations (see Environment Variables guide)
ZOHO_CLIENT_ID=your-zoho-client-id
CLIO_CLIENT_ID=your-clio-client-id
# ... additional configuration
```

## Database Setup

### 1. MongoDB Database Creation
```bash
# Connect to MongoDB
mongosh

# Create the development database
use equisettle-dev

# Create a test collection to initialize the database
db.test.insertOne({message: "Database initialized"})

# Exit MongoDB shell
exit
```

### 2. Database Seeding (Optional)
```bash
# Run database seeding scripts
npm run seed:dev

# Or manually seed specific collections
npm run seed:companies
npm run seed:users
npm run seed:demo-data
```

## Development Tools Setup

### 1. IDE Configuration (VS Code Recommended)

#### Install VS Code Extensions
```bash
# Essential extensions for Node.js development
code --install-extension ms-vscode.vscode-json
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension bradlc.vscode-tailwindcss
code --install-extension esbenp.prettier-vscode
code --install-extension ms-vscode.vscode-eslint
```

#### VS Code Settings
Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  },
  "files.associations": {
    "*.env*": "properties"
  }
}
```

### 2. Debugging Setup

#### VS Code Debug Configuration
Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug ÉquiSettle Backend",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/src/app.js",
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal",
      "restart": true,
      "runtimeExecutable": "nodemon",
      "skipFiles": [
        "<node_internals>/**"
      ]
    }
  ]
}
```

## Verification & Testing

### 1. Start the Development Server
```bash
# Method 1: Using npm scripts
npm run dev

# Method 2: Using nodemon directly
nodemon src/app.js

# Method 3: Using PM2 for production-like environment
pm2 start ecosystem.config.js --env development
```

### 2. Health Check
```bash
# Test the health endpoint
curl http://localhost:8000/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2024-01-01T10:00:00.000Z",
  "services": {
    "database": "healthy",
    "redis": "healthy"
  }
}
```

### 3. API Testing
```bash
# Test authentication endpoint
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "testpassword"}'
```

### 4. Run Test Suite
```bash
# Run all tests
npm test

# Run specific test categories
npm run test:unit
npm run test:integration
npm run test:api

# Run tests with coverage
npm run test:coverage
```

## Development Workflow

### 1. Branch Management
```bash
# Create a new feature branch
git checkout -b feature/your-feature-name

# Make your changes and commit
git add .
git commit -m "feat: add new feature description"

# Push and create pull request
git push origin feature/your-feature-name
```

### 2. Code Quality Tools
```bash
# Run linting
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format code
npm run format

# Check code formatting
npm run format:check
```

### 3. Pre-commit Hooks
The project uses Husky for pre-commit hooks:
```bash
# Install Husky
npm run prepare

# Pre-commit will automatically run:
# - ESLint
# - Prettier
# - Tests
# - Type checking
```

## Docker Setup (Alternative)

For a containerized development environment:

### 1. Docker Compose Setup
```yaml
# docker-compose.dev.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8000:8000"
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      - mongodb
      - redis

  mongodb:
    image: mongo:6.0
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  mongodb_data:
```

### 2. Run with Docker
```bash
# Build and start all services
docker-compose -f docker-compose.dev.yml up --build

# Run in background
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f app
```

## Troubleshooting Common Issues

### MongoDB Connection Issues
```bash
# Check MongoDB status
brew services list | grep mongodb  # macOS
systemctl status mongod           # Linux

# Reset MongoDB
brew services restart mongodb-community  # macOS
sudo systemctl restart mongod            # Linux
```

### Redis Connection Issues
```bash
# Check Redis status
redis-cli ping

# Restart Redis
brew services restart redis  # macOS
sudo systemctl restart redis # Linux
```

### Port Conflicts
```bash
# Check what's running on port 8000
lsof -i :8000

# Kill process if needed
kill -9 <PID>
```

### Node.js Version Issues
```bash
# Switch Node.js version
nvm use 18

# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

Once your development environment is set up:

1. **[Configure Environment Variables](./environment)** - Set up all required configuration
2. **[Quick Start Guide](./quick-start)** - Build your first feature
3. **[Architecture Overview](../architecture/overview)** - Understand the system design
4. **[API Documentation](../api/authentication)** - Explore the API endpoints

## Additional Resources

- **[Contributing Guide](../development/coding-standards)** - Development best practices
- **[Testing Guide](../testing/overview)** - Testing strategies and tools
- **[Debugging Guide](../troubleshooting/debugging)** - Debugging techniques
- **[Performance Guide](../troubleshooting/performance)** - Performance optimization

Your development environment is now ready for building with the ÉquiSettle platform!