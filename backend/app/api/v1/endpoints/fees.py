from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.fees import Fee
from app.schemas.fees import FeesCreate

router = APIRouter()


@router.post("/create")
def create_fees(
    fees: FeesCreate,
    db: Session = Depends(get_db)
):

    new_fees = Fee(
        student_id=fees.student_id,
        total_amount=fees.total_amount,
        paid_amount=fees.paid_amount,
        balance_amount=fees.balance_amount,
        status=fees.status
    )

    db.add(new_fees)

    db.commit()

    return {
        "message": "Fees record created"
    }


@router.post("/")
def create_fees_rest(
    fees: FeesCreate,
    db: Session = Depends(get_db)
):
    return create_fees(fees=fees, db=db)


@router.get("/")
def get_fees(
    skip: int = 0,
    limit: int = 10,
    student_id: int | None = None,
    status: str | None = None,
    db: Session = Depends(get_db)
):
    query = db.query(Fee)
    if student_id is not None:
        query = query.filter(Fee.student_id == student_id)
    if status:
        query = query.filter(Fee.status == status)

    fees = query.offset(skip).limit(limit).all()

    return fees