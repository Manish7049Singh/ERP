from sqlalchemy import Column, Integer, String, ForeignKey
from app.db.session import Base


class Timetable(Base):

    __tablename__ = "timetable"

    id = Column(Integer, primary_key=True, index=True)

    day = Column(String)

    start_time = Column(String)

    end_time = Column(String)

    room = Column(String)

    subject_id = Column(
        Integer,
        ForeignKey("subjects.id")
    )

    faculty_id = Column(
        Integer,
        ForeignKey("faculty.id")
    )