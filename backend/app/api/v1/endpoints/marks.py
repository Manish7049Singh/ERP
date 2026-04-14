from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.marks import Marks
from app.schemas.marks import MarksCreate
from fastapi import Query


router = APIRouter()


# ADD MARKS
@router.post("/add")
def add_marks(
    marks: MarksCreate,
    db: Session = Depends(get_db)
):

    new_marks = Marks(
        student_id=marks.student_id,
        course_id=marks.course_id,
        exam_type=marks.exam_type,
        marks_obtained=marks.marks_obtained
    )

    db.add(new_marks)
    db.commit()
    db.refresh(new_marks)

    return {
        "message": "Marks recorded successfully"
    }


@router.post("/")
def add_marks_rest(
    marks: MarksCreate,
    db: Session = Depends(get_db)
):
    return add_marks(marks=marks, db=db)


# GET ALL MARKS
@router.get("/all")
def get_all_marks(
    db: Session = Depends(get_db)
):

    records = db.query(Marks).all()

    return records
# from sqlalchemy.orm import Session
# from fastapi import Depends


@router.get("/")
def get_marks(
    skip: int = 0,
    limit: int = 10,
    student_id: int | None = None,
    course_id: int | None = None,
    db: Session = Depends(get_db)
):
    query = db.query(Marks)
    if student_id is not None:
        query = query.filter(Marks.student_id == student_id)
    if course_id is not None:
        query = query.filter(Marks.course_id == course_id)

    marks = query.offset(skip).limit(limit).all()

    return marks