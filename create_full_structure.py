import os

paths = [

# ROOT FILES
".gitignore",
".editorconfig",
"Makefile",
"README.md",

# GITHUB
".github/workflows/ci.yml",
".github/workflows/cd-staging.yml",
".github/workflows/cd-production.yml",
".github/workflows/pr-check.yml",
".github/ISSUE_TEMPLATE/bug_report.md",
".github/ISSUE_TEMPLATE/feature_request.md",
".github/PULL_REQUEST_TEMPLATE.md",

# BACKEND
"backend/.env.example",
"backend/pyproject.toml",
"backend/pytest.ini",

# ALEMBIC
"backend/alembic/env.py",
"backend/alembic/script.py.mako",
"backend/alembic/alembic.ini",

# APP CORE FILES
"backend/app/__init__.py",
"backend/app/main.py",

# API
"backend/app/api/__init__.py",
"backend/app/api/deps.py",
"backend/app/api/v1/__init__.py",
"backend/app/api/v1/router.py",

# ENDPOINTS
"backend/app/api/v1/endpoints/auth.py",
"backend/app/api/v1/endpoints/users.py",
"backend/app/api/v1/endpoints/students.py",
"backend/app/api/v1/endpoints/faculty.py",
"backend/app/api/v1/endpoints/departments.py",
"backend/app/api/v1/endpoints/courses.py",
"backend/app/api/v1/endpoints/subjects.py",
"backend/app/api/v1/endpoints/attendance.py",
"backend/app/api/v1/endpoints/marks.py",
"backend/app/api/v1/endpoints/timetable.py",
"backend/app/api/v1/endpoints/fees.py",
"backend/app/api/v1/endpoints/notifications.py",
"backend/app/api/v1/endpoints/reports.py",

# CORE
"backend/app/core/config.py",
"backend/app/core/security.py",
"backend/app/core/exceptions.py",
"backend/app/core/constants.py",

# DB
"backend/app/db/session.py",
"backend/app/db/base.py",

# MODELS
"backend/app/models/user.py",
"backend/app/models/student.py",
"backend/app/models/faculty.py",
"backend/app/models/department.py",
"backend/app/models/course.py",
"backend/app/models/subject.py",
"backend/app/models/attendance.py",
"backend/app/models/marks.py",
"backend/app/models/timetable.py",
"backend/app/models/fee.py",
"backend/app/models/notification.py",

# SCHEMAS
"backend/app/schemas/auth.py",
"backend/app/schemas/user.py",
"backend/app/schemas/student.py",
"backend/app/schemas/faculty.py",
"backend/app/schemas/department.py",
"backend/app/schemas/course.py",
"backend/app/schemas/subject.py",
"backend/app/schemas/attendance.py",
"backend/app/schemas/marks.py",
"backend/app/schemas/timetable.py",
"backend/app/schemas/fee.py",
"backend/app/schemas/notification.py",
"backend/app/schemas/report.py",

# SERVICES
"backend/app/services/auth_service.py",
"backend/app/services/user_service.py",
"backend/app/services/student_service.py",
"backend/app/services/faculty_service.py",
"backend/app/services/department_service.py",
"backend/app/services/course_service.py",
"backend/app/services/subject_service.py",
"backend/app/services/attendance_service.py",
"backend/app/services/marks_service.py",
"backend/app/services/timetable_service.py",
"backend/app/services/fee_service.py",
"backend/app/services/notification_service.py",
"backend/app/services/report_service.py",

# REPOSITORIES
"backend/app/repositories/user_repository.py",
"backend/app/repositories/student_repository.py",
"backend/app/repositories/faculty_repository.py",
"backend/app/repositories/department_repository.py",
"backend/app/repositories/course_repository.py",
"backend/app/repositories/subject_repository.py",
"backend/app/repositories/attendance_repository.py",
"backend/app/repositories/marks_repository.py",
"backend/app/repositories/timetable_repository.py",
"backend/app/repositories/fee_repository.py",
"backend/app/repositories/notification_repository.py",

# MIDDLEWARE
"backend/app/middleware/auth_middleware.py",
"backend/app/middleware/logging_middleware.py",
"backend/app/middleware/error_handler.py",
"backend/app/middleware/rate_limiter.py",

# UTILS
"backend/app/utils/helpers.py",
"backend/app/utils/validators.py",
"backend/app/utils/formatters.py",
"backend/app/utils/email.py",

# TESTS
"backend/tests/conftest.py",
"backend/tests/fixtures/data.py",

# SCRIPTS
"backend/scripts/seed_db.py",
"backend/scripts/create_admin.py",
"backend/scripts/backup_db.py",

# FRONTEND FILES
"frontend/.env.example",
"frontend/package.json",
"frontend/tailwind.config.js",
"frontend/postcss.config.js",
"frontend/vite.config.js",
"frontend/src/index.js",
"frontend/src/App.jsx",

# DEVOPS
"devops/nginx/nginx.conf",
"devops/nginx/sites-available/college-erp.conf",
"devops/scripts/deploy.sh",
"devops/scripts/setup-server.sh",
"devops/scripts/backup.sh",
"devops/scripts/restore.sh",
"devops/scripts/health-check.sh",
"devops/systemd/college-erp.service",
"devops/env/.env.development",
"devops/env/.env.staging",
"devops/env/.env.production",

]

for path in paths:
    directory = os.path.dirname(path)
    if directory and not os.path.exists(directory):
        os.makedirs(directory, exist_ok=True)

    if not os.path.exists(path):
        open(path, "w").close()

print("✅ Full project structure with files created successfully!")