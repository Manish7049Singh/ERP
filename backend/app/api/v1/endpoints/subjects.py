from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.db.session import get_db
from app.models.subject import Subject
from app.schemas.subject import SubjectCreate

router = APIRouter()


@router.post("/create")
def create_subject(
    subject: SubjectCreate,
    db: Session = Depends(get_db)
):

    new_subject = Subject(
        name=subject.name,
        code=subject.code,
        semester=subject.semester,
        department_id=subject.department_id
    )

    try:
        db.add(new_subject)
        db.commit()
        db.refresh(new_subject)
        return new_subject
    except IntegrityError:
        db.rollback()
        return {"error": "Invalid department or duplicate subject code"}


@router.post("/")
def create_subject_rest(
    subject: SubjectCreate,
    db: Session = Depends(get_db)
):
    return create_subject(subject=subject, db=db)


@router.get("/")
def get_subjects(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db)
):

    subjects = (
        db.query(Subject)
        .offset(skip)
        .limit(limit)
        .all()
    )

    return subjects


@router.get("/{subject_id}")
def get_subject_by_id(
    subject_id: int,
    db: Session = Depends(get_db)
):
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject:
        return {"error": "Subject not found"}
    return subject