from sqlalchemy import Column, Integer, ForeignKey, String
from app.db.session import Base


class Marks(Base):

    __tablename__ = "marks"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(
        Integer,
        ForeignKey("students.id"),
        nullable=False
    )

    course_id = Column(
        Integer,
        ForeignKey("courses.id"),
        nullable=False
    )

    exam_type = Column(
        String,
        nullable=False
    )

    marks_obtained = Column(
        Integer,
        nullable=False
    )