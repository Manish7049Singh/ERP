#!/bin/bash

# Quick start script for local development

echo "Starting College ERP..."

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "Creating .env.production from template..."
    cat > .env.production << EOF
POSTGRES_DB=college_erp
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_PORT=5432
SECRET_KEY=dev-secret-key-change-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_MINUTES=10080
BACKEND_CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
NEXT_PUBLIC_API_URL=http://localhost:8000
BACKEND_PORT=8000
FRONTEND_PORT=3000
EOF
fi

# Start services
docker-compose up -d

echo "Waiting for services to start..."
sleep 15

# Create tables and test users
echo "Setting up database..."
docker-compose exec -T backend python -c "
from app.db.session import engine, Base
from app.db import base
Base.metadata.create_all(bind=engine)
print('✓ Tables created')
" 2>/dev/null || echo "Tables may already exist"

docker-compose exec -T backend python scripts/create_test_users.py 2>/dev/null || echo "Users may already exist"

echo ""
echo "✅ College ERP is running!"
echo ""
echo "Access:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:8000"
echo "  API Docs: http://localhost:8000/docs"
echo ""
echo "Login:"
echo "  Admin: admin@college.edu / admin123"
echo ""
echo "To stop: docker-compose down"
echo "To view logs: docker-compose logs -f"
