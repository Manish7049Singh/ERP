# 🚀 AWS EC2 Deployment Guide

## Prerequisites

- AWS Account
- EC2 instance (t3.small or larger recommended)
- Ubuntu 22.04 LTS
- Security group with ports 22, 80, 3000, 8000 open

## Step 1: Launch EC2 Instance

### Recommended Instance Type
- **t3.small** (2 vCPU, 2 GB RAM) - Minimum
- **t3.medium** (2 vCPU, 4 GB RAM) - Recommended for production

### Security Group Rules
```
Inbound Rules:
- SSH (22) - Your IP
- HTTP (80) - 0.0.0.0/0
- Custom TCP (3000) - 0.0.0.0/0  # Frontend
- Custom TCP (8000) - 0.0.0.0/0  # Backend API
```

## Step 2: Connect to EC2

```bash
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

## Step 3: Install Docker & Docker Compose

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version

# Logout and login again for group changes
exit
```

## Step 4: Clone Your Repository

```bash
# Reconnect to EC2
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP

# Clone repository
git clone YOUR_REPOSITORY_URL
cd college-erp
```

## Step 5: Configure Environment

```bash
# Copy production environment template
cp .env.production .env.production.local

# Edit configuration
nano .env.production.local
```

**Update these values:**
```env
# Change password
POSTGRES_PASSWORD=YOUR_STRONG_PASSWORD_HERE

# Generate secret key (run this command):
# python -c "import secrets; print(secrets.token_urlsafe(32))"
SECRET_KEY=YOUR_GENERATED_SECRET_KEY

# Update with your EC2 public IP
BACKEND_CORS_ORIGINS=http://YOUR_EC2_IP:3000
NEXT_PUBLIC_API_URL=http://YOUR_EC2_IP:8000
```

**Get your EC2 public IP:**
```bash
curl http://checkip.amazonaws.com
```

## Step 6: Deploy Application

```bash
# Make deploy script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

## Step 7: Verify Deployment

```bash
# Check running containers
docker-compose ps

# Check logs
docker-compose logs -f

# Test backend
curl http://localhost:8000/health

# Test frontend
curl http://localhost:3000
```

## Step 8: Access Application

Open in browser:
- **Frontend**: `http://YOUR_EC2_IP:3000`
- **Backend API**: `http://YOUR_EC2_IP:8000`
- **API Docs**: `http://YOUR_EC2_IP:8000/docs`

## Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@college.edu | admin123 |
| Faculty | faculty@college.edu | faculty123 |
| Student | student@college.edu | student123 |
| Accountant | accountant@college.edu | acc123 |

## Useful Commands

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Restart Services
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Stop Services
```bash
docker-compose down
```

### Update Application
```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Database Backup
```bash
# Backup
docker-compose exec postgres pg_dump -U postgres college_erp > backup.sql

# Restore
docker-compose exec -T postgres psql -U postgres college_erp < backup.sql
```

### Check Database
```bash
# Connect to database
docker-compose exec postgres psql -U postgres -d college_erp

# List tables
\dt

# View users
SELECT * FROM users;

# Exit
\q
```

## Troubleshooting

### Services won't start
```bash
# Check logs
docker-compose logs

# Check disk space
df -h

# Check memory
free -h
```

### Can't connect to frontend
```bash
# Check if port 3000 is open
sudo netstat -tulpn | grep 3000

# Check security group allows port 3000
```

### Database connection errors
```bash
# Check postgres is running
docker-compose ps postgres

# Check postgres logs
docker-compose logs postgres

# Restart postgres
docker-compose restart postgres
```

### Out of memory
```bash
# Add swap space
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

## Production Optimizations

### 1. Use Nginx Reverse Proxy

```bash
# Install Nginx
sudo apt install nginx -y

# Configure Nginx
sudo nano /etc/nginx/sites-available/college-erp
```

```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN_OR_IP;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/college-erp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 2. Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate
sudo certbot --nginx -d YOUR_DOMAIN
```

### 3. Setup Auto-start on Boot

```bash
# Enable Docker to start on boot
sudo systemctl enable docker

# Containers will auto-start with restart: unless-stopped
```

### 4. Monitor Resources

```bash
# Install htop
sudo apt install htop -y

# Monitor
htop

# Docker stats
docker stats
```

## Security Best Practices

1. **Change default passwords** immediately
2. **Use strong SECRET_KEY** (32+ characters)
3. **Restrict security group** to specific IPs
4. **Enable SSL/HTTPS** for production
5. **Regular backups** of database
6. **Update system** regularly: `sudo apt update && sudo apt upgrade`
7. **Monitor logs** for suspicious activity

## Cost Optimization

### t3.micro (Free Tier)
- **Pros**: Free for 12 months
- **Cons**: Only 1GB RAM, may be slow
- **Use**: Development/testing only

### t3.small ($15-20/month)
- **Pros**: 2GB RAM, good performance
- **Cons**: Not free
- **Use**: Small production (< 100 users)

### t3.medium ($30-40/month)
- **Pros**: 4GB RAM, better performance
- **Cons**: Higher cost
- **Use**: Production (100-500 users)

## Monitoring

### Check Application Health
```bash
# Backend health
curl http://localhost:8000/health

# Check all users
docker-compose exec backend python scripts/show_all_users.py
```

### Monitor Logs
```bash
# Real-time logs
docker-compose logs -f --tail=100
```

## Support

If you encounter issues:
1. Check logs: `docker-compose logs`
2. Verify environment variables in `.env.production.local`
3. Ensure security group allows required ports
4. Check EC2 instance has enough resources

---

**Your College ERP is now deployed on AWS EC2!** 🎉
