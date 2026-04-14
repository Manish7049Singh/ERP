from sqlalchemy import Column, Integer, Float, String, ForeignKey
from app.db.session import Base


class Fee(Base):

    __tablename__ = "fees"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(
        Integer,
        ForeignKey("students.id")
    )

    total_amount = Column(Float)

    paid_amount = Column(Float)

    balance_amount = Column(Float)

    status = Column(String)