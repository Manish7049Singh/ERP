#!/bin/bash

# SonarQube Analysis Script

set -e

echo "========================================="
echo "SonarQube Code Quality Analysis"
echo "========================================="

# Your SonarQube token
SONAR_TOKEN="c6f4ae487d1a12dc20e434c338bbcd597bb300a2"

# Check if SonarQube is running
echo "Checking if SonarQube is accessible..."
if ! curl -s http://localhost:9000 > /dev/null; then
    echo "SonarQube is not running. Starting SonarQube..."
    docker-compose -f docker-compose.sonar.yml up -d sonarqube
    echo "Waiting for SonarQube to start (this may take 1-2 minutes)..."
    sleep 60
fi

# Wait for SonarQube to be ready
echo "Waiting for SonarQube to be ready..."
until curl -s http://localhost:9000/api/system/status | grep -q '"status":"UP"'; do
    echo "SonarQube is starting..."
    sleep 5
done

echo "✓ SonarQube is ready!"

# Run SonarQube scanner
echo ""
echo "Running code analysis..."
echo ""

docker run --rm \
    --network host \
    -e SONAR_HOST_URL="http://localhost:9000" \
    -e SONAR_TOKEN="${SONAR_TOKEN}" \
    -v "$(pwd):/usr/src" \
    sonarsource/sonar-scanner-cli \
    -Dsonar.projectKey=college-erp \
    -Dsonar.projectName="College ERP System" \
    -Dsonar.projectVersion=1.0 \
    -Dsonar.sources=backend/app,frontend/app,frontend/components,frontend/services \
    -Dsonar.tests=backend/tests \
    -Dsonar.exclusions="**/node_modules/**,**/__pycache__/**,**/venv/**,**/.next/**,**/dist/**,**/build/**" \
    -Dsonar.python.version=3.11 \
    -Dsonar.sourceEncoding=UTF-8

echo ""
echo "========================================="
echo "✓ Analysis Complete!"
echo "========================================="
echo ""
echo "View results at: http://localhost:9000"
echo "Project: college-erp"
echo ""
echo "Default credentials:"
echo "  Username: admin"
echo "  Password: admin"
echo ""
echo "To stop SonarQube:"
echo "  docker-compose -f docker-compose.sonar.yml down"
echo ""
