from sqlalchemy import Column, Integer, String
from app.db.session import Base


class Student(Base):

    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(String, unique=True, index=True)

    name = Column(String)

    email = Column(String, unique=True)

    phone = Column(String)

    department = Column(String)

    year = Column(Integer)