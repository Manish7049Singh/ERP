from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.enrollment import Enrollment
from app.schemas.enrollment import EnrollmentCreate

router = APIRouter()


# ENROLL STUDENT
@router.post("/enroll")
def enroll_student(
    enrollment: EnrollmentCreate,
    db: Session = Depends(get_db)
):

    new_enrollment = Enrollment(
        student_id=enrollment.student_id,
        course_id=enrollment.course_id
    )

    db.add(new_enrollment)
    db.commit()
    db.refresh(new_enrollment)

    return {
        "message": "Student enrolled successfully"
    }


# GET ALL ENROLLMENTS
@router.get("/all")
def get_all_enrollments(
    db: Session = Depends(get_db)
):

    enrollments = db.query(Enrollment).all()

    return enrollments
from fastapi import Query
from sqlalchemy.orm import Session
from fastapi import Depends


@router.get("/")
def get_enrollments(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db)
):

    enrollments = (
        db.query(Enrollment)
        .offset(skip)
        .limit(limit)
        .all()
    )

    return enrollments