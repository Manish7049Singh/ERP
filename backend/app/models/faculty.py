from sqlalchemy import Column, Integer, String
from app.db.session import Base


class Faculty(Base):

    __tablename__ = "faculty"

    id = Column(Integer, primary_key=True, index=True)

    faculty_id = Column(
        String,
        unique=True,
        index=True,
        nullable=False
    )

    name = Column(String, nullable=False)

    email = Column(
        String,
        unique=True,
        nullable=False
    )

    phone = Column(String, nullable=False)

    department = Column(String, nullable=False)

    designation = Column(String, nullable=False)