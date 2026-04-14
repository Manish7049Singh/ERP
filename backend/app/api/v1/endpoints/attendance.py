from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.attendance import Attendance
from app.schemas.attendance import AttendanceCreate
from fastapi import Query

router = APIRouter()


# MARK ATTENDANCE
@router.post("/mark")
def mark_attendance(
    attendance: AttendanceCreate,
    db: Session = Depends(get_db)
):

    new_attendance = Attendance(
        student_id=attendance.student_id,
        course_id=attendance.course_id,
        date=attendance.date,
        status=attendance.status
    )

    db.add(new_attendance)
    db.commit()
    db.refresh(new_attendance)

    return {
        "message": "Attendance recorded"
    }


@router.post("/")
def mark_attendance_rest(
    attendance: AttendanceCreate,
    db: Session = Depends(get_db)
):
    return mark_attendance(attendance=attendance, db=db)


# GET ATTENDANCE
@router.get("/all")
def get_all_attendance(
    db: Session = Depends(get_db)
):

    records = db.query(Attendance).all()

    return records



@router.get("/")
def get_attendance(
    skip: int = 0,
    limit: int = 10,
    student_id: int | None = None,
    course_id: int | None = None,
    db: Session = Depends(get_db)
):
    query = db.query(Attendance)
    if student_id is not None:
        query = query.filter(Attendance.student_id == student_id)
    if course_id is not None:
        query = query.filter(Attendance.course_id == course_id)

    attendance = query.offset(skip).limit(limit).all()

    return attendance