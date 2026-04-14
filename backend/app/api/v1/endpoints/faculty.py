from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.db.session import get_db
from app.models.faculty import Faculty
from app.schemas.faculty import FacultyCreate
from fastapi import Query


router = APIRouter()


# CREATE FACULTY
@router.post("/create")
def create_faculty(
    faculty: FacultyCreate,
    db: Session = Depends(get_db)
):

    try:
        new_faculty = Faculty(
            faculty_id=faculty.faculty_id,
            name=faculty.name,
            email=faculty.email,
            phone=faculty.phone,
            department=faculty.department,
            designation=faculty.designation
        )

        db.add(new_faculty)
        db.commit()
        db.refresh(new_faculty)

        return {
            "message": "Faculty created"
        }

    except IntegrityError:

        db.rollback()

        return {
            "error": "Faculty with this email or ID already exists"
        }


# GET ALL FACULTY
@router.get("/")
def get_faculty(
    skip: int = 0,
    limit: int = 10,
    search: str = Query(default=None),
    email: str = Query(default=None),
    department: str = Query(default=None),
    db: Session = Depends(get_db)
):

    query = db.query(Faculty)

    # SEARCH by name
    if search:

        query = query.filter(
            Faculty.name.ilike(f"%{search}%")
        )
    if email:
        query = query.filter(Faculty.email == email)
    if department:
        query = query.filter(Faculty.department == department)

    faculty = (
        query
        .offset(skip)
        .limit(limit)
        .all()
    )

    return faculty


@router.get("/{faculty_id}")
def get_faculty_by_id(
    faculty_id: str,
    db: Session = Depends(get_db)
):
    db_faculty = db.query(Faculty).filter(Faculty.faculty_id == faculty_id).first()
    if not db_faculty:
        return {"error": "Faculty not found"}
    return db_faculty


# UPDATE FACULTY
@router.put("/update/{faculty_id}")
def update_faculty(
    faculty_id: str,
    faculty: FacultyCreate,
    db: Session = Depends(get_db)
):

    db_faculty = db.query(Faculty).filter(
        Faculty.faculty_id == faculty_id
    ).first()

    if not db_faculty:
        return {
            "error": "Faculty not found"
        }

    db_faculty.name = faculty.name
    db_faculty.email = faculty.email
    db_faculty.phone = faculty.phone
    db_faculty.department = faculty.department
    db_faculty.designation = faculty.designation

    db.commit()
    db.refresh(db_faculty)

    return {
        "message": "Faculty updated"
    }


@router.post("/")
def create_faculty_rest(
    faculty: FacultyCreate,
    db: Session = Depends(get_db)
):
    return create_faculty(faculty=faculty, db=db)


@router.put("/{faculty_id}")
def update_faculty_rest(
    faculty_id: str,
    faculty: FacultyCreate,
    db: Session = Depends(get_db)
):
    return update_faculty(faculty_id=faculty_id, faculty=faculty, db=db)


# DELETE FACULTY
@router.delete("/delete/{faculty_id}")
def delete_faculty(
    faculty_id: str,
    db: Session = Depends(get_db)
):

    db_faculty = db.query(Faculty).filter(
        Faculty.faculty_id == faculty_id
    ).first()

    if not db_faculty:
        return {
            "error": "Faculty not found"
        }

    db.delete(db_faculty)
    db.commit()

    return {
        "message": "Faculty deleted"
    }


@router.delete("/{faculty_id}")
def delete_faculty_rest(
    faculty_id: str,
    db: Session = Depends(get_db)
):
    return delete_faculty(faculty_id=faculty_id, db=db)