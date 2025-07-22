#!/bin/bash

# FULafia Mental Health Platform Deployment Script

set -e

echo "🚀 Starting FULafia Mental Health Platform deployment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating environment file..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your configuration before running again."
    exit 1
fi

# Build and start services
echo "🏗️  Building and starting services..."
docker-compose -f deployment/docker-compose.yml up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check if services are running
echo "🔍 Checking service status..."
docker-compose -f deployment/docker-compose.yml ps

echo "✅ Deployment completed!"
echo ""
echo "🌐 Your application is now available at:"
echo "   Frontend: http://localhost"
echo "   Backend API: http://localhost:5000"
echo ""
echo "📊 To view logs:"
echo "   docker-compose -f deployment/docker-compose.yml logs -f"
echo ""
echo "🛑 To stop services:"
echo "   docker-compose -f deployment/docker-compose.yml down"