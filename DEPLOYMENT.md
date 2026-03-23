# Nutri AI Deployment Guide

## Overview

This document outlines the deployment process for the Nutri AI backend services, including setup, troubleshooting, and maintenance procedures.

## System Architecture

- **Server**: Digital Ocean Droplet (Basic Tier)
- **IP Address**: 159.223.196.97
- **Container Configuration**:
  - API Server (Node.js/Express)
  - PostgreSQL Database
  - Redis Cache

## Prerequisites

- SSH Access to the server
- Docker and Docker Compose on the server
- Local development environment with Node.js

## Deployment Process

### 1. Initial Setup

```bash
# Clone the repository on the server
git clone <repository-url> /root/riskoptimize

# Set up environment variables
cd /root/riskoptimize
cp .env.example .env
# Edit .env file with appropriate values
```

### 2. Container Deployment

```bash
# Build and start the containers
cd /root/riskoptimize
docker-compose build --no-cache
docker-compose up -d
```

### 3. Verify Deployment

```bash
# Check container status
docker-compose ps

# Check API health
curl http://159.223.196.97:3001/api/v1/health

# View logs
docker-compose logs api
```

## Critical Dependencies

- **Node.js Version**: 16.x LTS
- **TypeScript Version**: 4.9.5
- **PostgreSQL Version**: 15-alpine
- **Redis Version**: 7-alpine

## Known Issues & Solutions

### TypeScript Compilation Errors

If you encounter TypeScript compilation errors with newer Node.js versions:

1. Use Node 16 LTS in the Dockerfile
2. Lock TypeScript version to 4.9.5
3. Use `npx tsc` directly instead of npm scripts

```Dockerfile
# Modified Dockerfile example
FROM node:16-alpine
# ...
RUN npm uninstall typescript && npm install typescript@4.9.5 --save-dev
RUN npx tsc --outDir dist
```

### Package Dependency Issues

If package.json and package-lock.json get out of sync:

1. Run `npm install` locally first
2. Sync both files to the server
3. Rebuild containers with `--no-cache` flag

```bash
# Fix package files locally
cd backend
npm install

# Sync to server
rsync -avz --exclude node_modules --exclude dist ./ root@159.223.196.97:/root/riskoptimize/

# Clean rebuild on server
ssh root@159.223.196.97 "cd /root/riskoptimize && docker-compose down && \
  docker system prune -f && docker-compose build --no-cache api && \
  docker-compose up -d"
```

## Maintenance

### Container Monitoring

A systemd service monitors container health and automatically restarts any failed containers.

```bash
# Check monitor service status
ssh root@159.223.196.97 "systemctl status docker-monitor.service"

# View monitor logs
ssh root@159.223.196.97 "cat /var/log/docker-monitor.log"
```

### Database Backups

Regular PostgreSQL backups are configured to run daily:

```bash
# Manual backup
ssh root@159.223.196.97 "docker exec riskoptimize_db_1 pg_dump -U user nutridb > /root/backups/nutridb_\$(date +%Y%m%d).sql"
```

## Troubleshooting

### Container Startup Issues

If containers fail to start:

1. Check logs: `docker-compose logs api`
2. Verify database connection: `docker exec riskoptimize_db_1 psql -U user -d nutridb -c "SELECT 1;"`
3. Check port conflicts: `netstat -tulpn | grep LISTEN`
4. Clean restart: `docker-compose down && docker-compose up -d`

### Performance Issues

If the application experiences slowdowns:

1. Check resource usage: `docker stats`
2. Verify database indexes: `docker exec riskoptimize_db_1 psql -U user -d nutridb -c "\di+"`
3. Clear Redis cache if needed: `docker exec riskoptimize_cache_1 redis-cli FLUSHALL`

## Contact

For deployment issues, contact the DevOps team at [devops@example.com](mailto:devops@example.com).
