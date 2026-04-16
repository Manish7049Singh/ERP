from copy import deepcopy


ADMIN_USER_PAYLOAD = {
    "name": "Admin Tester",
    "email": "admin@example.com",
    "password": "admin12345",
    "role": "admin",
}

FACULTY_USER_PAYLOAD = {
    "name": "Faculty Tester",
    "email": "faculty@example.com",
    "password": "faculty12345",
    "role": "faculty",
}

STUDENT_USER_PAYLOAD = {
    "name": "Student Tester",
    "email": "student@example.com",
    "password": "student12345",
    "role": "student",
}

DEPARTMENT_PAYLOAD = {"name": "Computer Science", "code": "CSE"}

COURSE_PAYLOAD = {
    "course_code": "BTECH-CSE",
    "name": "B.Tech Computer Science",
    "department": "Computer Science",
    "semester": 1,
    "credits": 20,
}

SUBJECT_PAYLOAD = {
    "name": "Data Structures",
    "code": "CSE201",
    "semester": 3,
    "department_id": 1,
}

STUDENT_PAYLOAD = {
    "student_id": "STU001",
    "name": "Aarav Sharma",
    "email": "aarav.sharma@example.com",
    "phone": "9876543210",
    "department": "Computer Science",
    "year": 2,
}


def payload(data: dict) -> dict:
    """Return a deep-copied payload so tests can mutate safely."""
    return deepcopy(data)
