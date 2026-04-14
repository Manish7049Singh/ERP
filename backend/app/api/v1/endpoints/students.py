from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.db.session import get_db
from app.models.student import Student
from app.schemas.student import StudentCreate

router = APIRouter()


@router.post("/")
def create_student(
    student: StudentCreate,
    db: Session = Depends(get_db)
):
    try:
        new_student = Student(
            student_id=student.student_id,
            name=student.name,
            email=student.email,
            phone=student.phone,
            department=student.department,
            year=student.year
        )
        db.add(new_student)
        db.commit()
        db.refresh(new_student)
        return new_student
    except IntegrityError:
        db.rollback()
        return {"error": "Student with this email or ID already exists"}


@router.get("/")
def get_students(
    skip: int = 0,
    limit: int = 10,
    search: str = Query(default=None),
    email: str = Query(default=None),
    department: str = Query(default=None),
    db: Session = Depends(get_db)
):

    query = db.query(Student)

    # SEARCH
    if search:

        query = query.filter(
            Student.name.ilike(f"%{search}%")
        )
    if email:
        query = query.filter(Student.email == email)
    if department:
        query = query.filter(Student.department == department)

    students = (
        query
        .offset(skip)
        .limit(limit)
        .all()
    )

    return students


@router.get("/{student_id}")
def get_student_by_id(
    student_id: str,
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.student_id == student_id).first()
    if not student:
        return {"error": "Student not found"}
    return student