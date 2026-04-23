# 🔍 SonarQube Integration Guide

## What is SonarQube?

SonarQube is a code quality and security analysis tool that helps you:
- Find bugs and vulnerabilities
- Detect code smells
- Measure code coverage
- Track technical debt
- Enforce coding standards

## Quick Start

### Option 1: Using the Script (Recommended)

```bash
# Make script executable
chmod +x sonarqube-scan.sh

# Run analysis
./sonarqube-scan.sh
```

This will:
1. Start SonarQube server (if not running)
2. Wait for it to be ready
3. Run code analysis
4. Show results URL

### Option 2: Manual Setup

#### Step 1: Start SonarQube

```bash
docker-compose -f docker-compose.sonar.yml up -d sonarqube
```

Wait 1-2 minutes for SonarQube to start.

#### Step 2: Access SonarQube

Open: http://localhost:9000

**Default credentials:**
- Username: `admin`
- Password: `admin`

(You'll be prompted to change the password on first login)

#### Step 3: Run Analysis

```bash
docker run --rm \
    --network host \
    -e SONAR_HOST_URL="http://localhost:9000" \
    -e SONAR_TOKEN="c6f4ae487d1a12dc20e434c338bbcd597bb300a2" \
    -v "$(pwd):/usr/src" \
    sonarsource/sonar-scanner-cli \
    -Dsonar.projectKey=college-erp
```

## What Gets Analyzed

### Backend (Python)
- `backend/app/` - All application code
- Code quality metrics
- Security vulnerabilities
- Code duplication
- Complexity analysis

### Frontend (TypeScript/React)
- `frontend/app/` - Next.js pages
- `frontend/components/` - React components
- `frontend/services/` - API services
- TypeScript type safety
- React best practices

### Excluded
- `node_modules/`
- `__pycache__/`
- `venv/`
- `.next/`
- `dist/`
- `build/`
- Test files

## Understanding Results

### Quality Gate
- **Passed**: Code meets quality standards ✅
- **Failed**: Issues need attention ❌

### Metrics

1. **Bugs**: Actual errors in code
2. **Vulnerabilities**: Security issues
3. **Code Smells**: Maintainability issues
4. **Coverage**: Test coverage percentage
5. **Duplications**: Duplicate code blocks
6. **Security Hotspots**: Potential security risks

### Severity Levels
- **Blocker**: Must fix immediately
- **Critical**: Should fix ASAP
- **Major**: Should fix
- **Minor**: Nice to fix
- **Info**: For information

## Viewing Results

### Dashboard
http://localhost:9000/dashboard?id=college-erp

Shows:
- Overall quality gate status
- New issues
- Coverage
- Duplications
- Security rating

### Issues
http://localhost:9000/project/issues?id=college-erp

Filter by:
- Type (Bug, Vulnerability, Code Smell)
- Severity
- Status
- File

### Measures
http://localhost:9000/component_measures?id=college-erp

Detailed metrics:
- Reliability
- Security
- Maintainability
- Coverage
- Duplications

## CI/CD Integration

### GitHub Actions

Create `.github/workflows/sonarqube.yml`:

```yaml
name: SonarQube Analysis

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  sonarqube:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      
      - name: SonarQube Scan
        uses: sonarsource/sonarqube-scan-action@master
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
          SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
```

### GitLab CI

Add to `.gitlab-ci.yml`:

```yaml
sonarqube:
  image: sonarsource/sonar-scanner-cli:latest
  script:
    - sonar-scanner
      -Dsonar.projectKey=college-erp
      -Dsonar.host.url=$SONAR_HOST_URL
      -Dsonar.token=$SONAR_TOKEN
  only:
    - main
    - develop
```

## Configuration

### Project Settings

Edit `sonar-project.properties`:

```properties
# Project info
sonar.projectKey=college-erp
sonar.projectName=College ERP System
sonar.projectVersion=1.0

# Source paths
sonar.sources=backend/app,frontend/app

# Exclusions
sonar.exclusions=**/node_modules/**,**/venv/**

# Language versions
sonar.python.version=3.11
```

### Quality Profiles

1. Go to **Quality Profiles**
2. Select language (Python, TypeScript)
3. Customize rules
4. Set as default

### Quality Gates

1. Go to **Quality Gates**
2. Create custom gate or use default
3. Set conditions:
   - Coverage > 80%
   - Duplications < 3%
   - Maintainability Rating = A
   - Security Rating = A

## Common Issues

### SonarQube won't start

```bash
# Check logs
docker-compose -f docker-compose.sonar.yml logs sonarqube

# Increase memory
docker-compose -f docker-compose.sonar.yml down
# Edit docker-compose.sonar.yml and add:
# environment:
#   - SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true
docker-compose -f docker-compose.sonar.yml up -d
```

### Analysis fails

```bash
# Check scanner logs
docker logs sonar-scanner

# Verify token
echo $SONAR_TOKEN

# Check network
curl http://localhost:9000/api/system/status
```

### Can't access dashboard

```bash
# Check if SonarQube is running
docker ps | grep sonarqube

# Check port
netstat -tulpn | grep 9000

# Restart
docker-compose -f docker-compose.sonar.yml restart sonarqube
```

## Best Practices

1. **Run regularly**: Before commits, PRs, releases
2. **Fix blockers first**: Address critical issues immediately
3. **Monitor trends**: Track quality over time
4. **Set quality gates**: Enforce standards
5. **Review new issues**: Focus on new code
6. **Increase coverage**: Add tests for uncovered code
7. **Reduce duplication**: Refactor duplicate code

## Useful Commands

```bash
# Start SonarQube
docker-compose -f docker-compose.sonar.yml up -d sonarqube

# Stop SonarQube
docker-compose -f docker-compose.sonar.yml down

# View logs
docker-compose -f docker-compose.sonar.yml logs -f sonarqube

# Run analysis
./sonarqube-scan.sh

# Check status
curl http://localhost:9000/api/system/status

# Backup data
docker-compose -f docker-compose.sonar.yml exec sonarqube tar czf /tmp/sonar-backup.tar.gz /opt/sonarqube/data
```

## Resources

- **SonarQube Docs**: https://docs.sonarqube.org
- **Rules**: https://rules.sonarsource.com
- **Community**: https://community.sonarsource.com

## Your Configuration

- **Token**: `c6f4ae487d1a12dc20e434c338bbcd597bb300a2`
- **URL**: http://localhost:9000
- **Project Key**: `college-erp`

---

**Start analyzing your code quality now!** 🔍
