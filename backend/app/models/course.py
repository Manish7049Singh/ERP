from sqlalchemy import Column, Integer, String
from app.db.session import Base


class Course(Base):

    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)

    course_code = Column(
        String,
        unique=True,
        index=True,
        nullable=False
    )

    name = Column(String, nullable=False)

    department = Column(String, nullable=False)

    semester = Column(Integer, nullable=False)

    credits = Column(Integer, nullable=False)