# 🎓 College ERP System

A modern, full-stack Enterprise Resource Planning system for educational institutions, built with FastAPI and Next.js.

## ✨ Features

### 👥 User Management
- Multi-role authentication (Admin, Faculty, Student, Accountant)
- Secure JWT-based authentication with refresh tokens
- Role-based access control
- **User Registration** ✅ Fully Working
- **User Login** ✅ Fully Working

### 📚 Academic Management
- **Departments** - Manage academic departments
- **Courses** - Course creation and management
- **Subjects** - Subject allocation and tracking
- **Enrollments** - Student course enrollment system
- **Timetable** - Class scheduling and management

### 📊 Student Services
- **Attendance** - Track and manage student attendance
- **Marks** - Grade entry and management
- **Results** - Automated result generation
- **Fees** - Fee management and payment tracking
- **Notifications** - Real-time notifications system

### 👨‍🏫 Faculty Management
- Faculty profiles and assignments
- Subject allocation
- Attendance marking interface

### 📈 Reports & Analytics
- Dashboard with key metrics
- Comprehensive reporting system
- Performance analytics

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **PostgreSQL** - Primary database
- **Pydantic** - Data validation
- **JWT** - Authentication
- **Alembic** - Database migrations

### Frontend
- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Component library
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Axios** - HTTP client
- **Recharts** - Data visualization

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Python 3.11+ (for local development)
- Node.js 18+ (for local development)

### Using Docker (Recommended)

1. Clone the repository
```bash
git clone <repository-url>
cd college-erp
```

2. Start all services
```bash
docker-compose up -d
```

3. Access the application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Local Development

#### Backend Setup

1. Navigate to backend directory
```bash
cd backend
```

2. Create virtual environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies
```bash
pip install -r requirements.txt
```

4. Configure environment
```bash
cp .env.example .env
# Edit .env with your settings
```

5. Run the server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup

1. Navigate to frontend directory
```bash
cd frontend
```

2. Install dependencies
```bash
npm install
# or
pnpm install
```

3. Configure environment
```bash
cp .env.example .env.local
# Edit .env.local with your API URL
```

4. Run development server
```bash
npm run dev
```

## 📁 Project Structure

```
college-erp/
├── backend/
│   ├── app/
│   │   ├── api/          # API endpoints
│   │   ├── core/         # Core configurations
│   │   ├── db/           # Database setup
│   │   ├── models/       # SQLAlchemy models
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── services/     # Business logic
│   │   ├── repositories/ # Data access layer
│   │   ├── middleware/   # Custom middleware
│   │   └── utils/        # Utility functions
│   ├── alembic/          # Database migrations
│   ├── scripts/          # Utility scripts
│   └── tests/            # Test suite
├── frontend/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── services/         # API services
│   ├── contexts/         # React contexts
│   ├── hooks/            # Custom hooks
│   └── types/            # TypeScript types
└── docker-compose.yml    # Docker orchestration
```

## 🔧 Configuration

### Backend Environment Variables
```env
DATABASE_URL=postgresql+psycopg2://user:password@localhost:5432/college_erp
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_MINUTES=10080
BACKEND_CORS_ORIGINS=http://localhost:3000
```

### Frontend Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🗄️ Database

The system uses PostgreSQL as the primary database. Tables are automatically created on startup.

### Initial Setup

Create an admin user:
```bash
cd backend
python scripts/create_admin.py
```

Seed sample data (optional):
```bash
python scripts/seed_db.py
```

## 📡 API Documentation

Interactive API documentation is available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 🧪 Testing

Run backend tests:
```bash
cd backend
pytest
```

## 🐳 Docker Deployment

The application is containerized and ready for deployment:

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## ☁️ AWS Deployment (t3.micro)

**Can this run on AWS t3.micro?**

Yes, but with considerations:

### t3.micro Specifications
- 2 vCPUs
- 1 GB RAM
- Burstable performance

### Recommendations

✅ **Suitable for:**
- Development/testing environments
- Small institutions (< 100 concurrent users)
- Proof of concept deployments

⚠️ **Limitations:**
- Limited RAM may cause issues with PostgreSQL + Backend + Frontend
- Performance degradation under load
- Database queries may be slow with large datasets

### Optimization Tips for t3.micro

1. **Use external database**
   - AWS RDS (db.t3.micro or db.t4g.micro)
   - Reduces memory pressure on main instance

2. **Deploy only backend on EC2**
   - Host frontend on Vercel/Netlify (free tier)
   - Significantly reduces resource usage

3. **Add swap space**
```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

4. **Optimize Docker**
   - Use production builds
   - Limit container memory
   - Enable Docker BuildKit

5. **Consider upgrading to t3.small**
   - 2 GB RAM provides better stability
   - Better suited for production use

### Recommended AWS Architecture

**Budget Option:**
- EC2 t3.micro (Backend only)
- RDS db.t3.micro (PostgreSQL)
- Vercel/Netlify (Frontend)
- CloudFront (CDN)

**Production Option:**
- EC2 t3.small or t3.medium
- RDS db.t3.small with Multi-AZ
- S3 + CloudFront for static assets
- Application Load Balancer
- Auto Scaling Group

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration
- Input validation with Pydantic
- SQL injection protection via SQLAlchemy ORM
- Rate limiting middleware

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue in the repository.

---

Built with ❤️ for educational institutions
