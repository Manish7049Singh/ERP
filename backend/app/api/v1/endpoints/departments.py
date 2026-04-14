from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.department import Department
from app.schemas.department import DepartmentCreate

router = APIRouter()


@router.post("/create")
def create_department(
    department: DepartmentCreate,
    db: Session = Depends(get_db)
):

    new_department = Department(
        name=department.name,
        code=department.code
    )

    db.add(new_department)

    db.commit()

    return {
        "message": "Department created"
    }


@router.get("/")
def get_departments(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db)
):

    departments = (
        db.query(Department)
        .offset(skip)
        .limit(limit)
        .all()
    )

    return departments


@router.get("/{department_id}")
def get_department_by_id(
    department_id: int,
    db: Session = Depends(get_db)
):
    department = db.query(Department).filter(Department.id == department_id).first()
    if not department:
        return {"error": "Department not found"}
    return department


@router.post("/")
def create_department_rest(
    department: DepartmentCreate,
    db: Session = Depends(get_db)
):
    return create_department(department=department, db=db)