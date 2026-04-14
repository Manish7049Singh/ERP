from sqlalchemy import Column, Integer, String
from app.db.session import Base


class Department(Base):

    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, unique=True)

    code = Column(String, unique=True)