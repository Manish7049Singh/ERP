from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime

from app.db.session import get_db
from app.models.marks import Marks
from app.models.result import Result
from app.core.permissions import require_role
from fastapi import Query
from fastapi import Query
from sqlalchemy.orm import Session
from fastapi import Depends

router = APIRouter()




@router.get("/")
def get_results(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db)
):

    results = (
        db.query(Result)
        .offset(skip)
        .limit(limit)
        .all()
    )

    return results




def calculate_grade(percentage):

    if percentage >= 90:
        return "A+"
    elif percentage >= 80:
        return "A"
    elif percentage >= 70:
        return "B"
    elif percentage >= 60:
        return "C"
    elif percentage >= 50:
        return "D"
    else:
        return "F"


# GENERATE RESULT
@router.post("/generate/{student_id}")
def generate_result(
    student_id: int,
    db: Session = Depends(get_db)
):

    existing_result = db.query(Result).filter(
        Result.student_id == student_id
    ).first()

    # LOCK CHECK
    if existing_result and existing_result.is_published:

        return {
            "error": "Result already published and locked"
        }

    marks = db.query(Marks).filter(
        Marks.student_id == student_id
    ).all()

    if not marks:

        return {
            "error": "No marks found for this student"
        }

    total_marks = sum(
        mark.marks_obtained for mark in marks
    )

    subjects = len(marks)

    percentage = (
        total_marks / (subjects * 100)
    ) * 100

    grade = calculate_grade(percentage)

    # UPDATE existing result
    if existing_result:

        existing_result.total_marks = total_marks
        existing_result.percentage = percentage
        existing_result.grade = grade

        db.commit()

        return {
            "message": "Result updated successfully"
        }

    # CREATE new result
    new_result = Result(
        student_id=student_id,
        total_marks=total_marks,
        percentage=percentage,
        grade=grade
    )

    db.add(new_result)
    db.commit()

    return {
        "message": "Result generated successfully"
    }


# GET RESULT
@router.get("/student/{student_id}")
def get_result(
    student_id: int,
    db: Session = Depends(get_db)
):

    result = db.query(Result).filter(
        Result.student_id == student_id
    ).first()

    if not result:

        return {
            "error": "Result not found"
        }

    return result


# PUBLISH RESULT (ADMIN ONLY)
@router.post("/publish/{student_id}")
def publish_result(
    student_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):

    result = db.query(Result).filter(
        Result.student_id == student_id
    ).first()

    if not result:

        return {
            "error": "Result not found"
        }

    result.is_published = True
    result.published_at = datetime.utcnow()

    db.commit()

    return {
        "message": "Result published successfully"
    }



@router.get("/")
def get_results(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db)
):

    results = (
        db.query(Result)
        .offset(skip)
        .limit(limit)
        .all()
    )

    return results