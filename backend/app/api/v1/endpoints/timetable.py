from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.db.session import get_db
from app.models.timetable import Timetable
from app.schemas.timetable import TimetableCreate

router = APIRouter()


@router.post("/create")
def create_timetable(
    timetable: TimetableCreate,
    db: Session = Depends(get_db)
):

    new_entry = Timetable(
        day=timetable.day,
        start_time=timetable.start_time,
        end_time=timetable.end_time,
        room=timetable.room,
        subject_id=timetable.subject_id,
        faculty_id=timetable.faculty_id
    )

    try:
        db.add(new_entry)
        db.commit()
        db.refresh(new_entry)
        return new_entry
    except IntegrityError:
        db.rollback()
        return {"error": "Invalid subject_id or faculty_id"}


@router.post("/")
def create_timetable_rest(
    timetable: TimetableCreate,
    db: Session = Depends(get_db)
):
    return create_timetable(timetable=timetable, db=db)


@router.get("/")
def get_timetable(
    skip: int = 0,
    limit: int = 10,
    faculty_id: int = Query(default=None),
    subject_id: int = Query(default=None),
    day: str = Query(default=None),
    db: Session = Depends(get_db)
):
    query = db.query(Timetable)
    if faculty_id is not None:
        query = query.filter(Timetable.faculty_id == faculty_id)
    if subject_id is not None:
        query = query.filter(Timetable.subject_id == subject_id)
    if day:
        query = query.filter(Timetable.day.ilike(day))

    timetable = query.offset(skip).limit(limit).all()

    return timetable


@router.get("/{entry_id}")
def get_timetable_entry(
    entry_id: int,
    db: Session = Depends(get_db)
):
    entry = db.query(Timetable).filter(Timetable.id == entry_id).first()
    if not entry:
        return {"error": "Timetable entry not found"}
    return entry