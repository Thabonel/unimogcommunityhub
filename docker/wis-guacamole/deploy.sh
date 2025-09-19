#!/bin/bash

# WIS Guacamole Deployment Script
# This script deploys the WIS remote desktop infrastructure

set -e

echo "🚀 Starting WIS Guacamole deployment..."

# Check if running as root (required for Docker operations)
if [[ $EUID -eq 0 ]]; then
   echo "⚠️  Running as root - this is required for Docker operations"
fi

# Check required commands
command -v docker >/dev/null 2>&1 || { echo "❌ Docker is required but not installed. Aborting." >&2; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo "❌ Docker Compose is required but not installed. Aborting." >&2; exit 1; }

# Check for environment file
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Please copy .env.example to .env and configure it."
    exit 1
fi

# Load environment variables
source .env

# Validate required environment variables
if [ -z "$GUACAMOLE_DB_PASSWORD" ]; then
    echo "❌ GUACAMOLE_DB_PASSWORD is not set in .env file"
    exit 1
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p nginx/ssl
mkdir -p data/guacamole-db
mkdir -p data/recordings
mkdir -p logs

# Check SSL certificates
if [ ! -f "nginx/ssl/$SSL_CERT_PATH" ] || [ ! -f "nginx/ssl/$SSL_KEY_PATH" ]; then
    echo "⚠️  SSL certificates not found. Generating self-signed certificates..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout "nginx/ssl/$SSL_KEY_PATH" \
        -out "nginx/ssl/$SSL_CERT_PATH" \
        -subj "/C=US/ST=State/L=City/O=Organization/CN=$WIS_DOMAIN"
    echo "✅ Self-signed certificates generated"
fi

# Set proper permissions
echo "🔒 Setting proper permissions..."
chmod 600 nginx/ssl/*
chmod 755 data/recordings
chown -R 1001:1001 data/recordings || echo "⚠️  Could not set ownership - you may need to run as root"

# Pull latest images
echo "📦 Pulling Docker images..."
docker-compose pull

# Build custom images
echo "🔨 Building custom images..."
docker-compose build

# Stop existing services if running
echo "🛑 Stopping existing services..."
docker-compose down

# Start services
echo "🚀 Starting WIS Guacamole services..."
docker-compose up -d

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 30

# Check service health
echo "🏥 Checking service health..."

# Check database
if docker-compose exec -T guacamole-db pg_isready -U guacamole_user -d guacamole_db; then
    echo "✅ Database is ready"
else
    echo "❌ Database is not ready"
    exit 1
fi

# Check Guacamole web interface
if curl -f -s -k "https://localhost/guacamole/" > /dev/null; then
    echo "✅ Guacamole web interface is accessible"
else
    echo "❌ Guacamole web interface is not accessible"
    echo "🔍 Checking logs..."
    docker-compose logs guacamole | tail -20
    exit 1
fi

# Check cleanup service
if docker-compose exec -T cleanup-service node src/health-check.js; then
    echo "✅ Cleanup service is healthy"
else
    echo "⚠️  Cleanup service may have issues"
fi

# Display connection information
echo ""
echo "🎉 WIS Guacamole deployment completed successfully!"
echo ""
echo "📋 Connection Information:"
echo "   Web Interface: https://$WIS_DOMAIN/guacamole/"
echo "   Health Check:  https://$WIS_DOMAIN/health"
echo ""
echo "📊 Service Status:"
docker-compose ps

echo ""
echo "📝 Next Steps:"
echo "1. Configure DNS to point $WIS_DOMAIN to this server"
echo "2. Set up WIS server VM with Mercedes software"
echo "3. Test connections from WIS interface"
echo "4. Monitor logs: docker-compose logs -f"
echo ""
echo "🔧 Maintenance Commands:"
echo "   View logs:     docker-compose logs -f [service]"
echo "   Restart:       docker-compose restart [service]"
echo "   Stop all:      docker-compose down"
echo "   Update:        docker-compose pull && docker-compose up -d"

# Show resource usage
echo ""
echo "💾 Resource Usage:"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}" $(docker-compose ps -q)

echo "✅ Deployment complete!"