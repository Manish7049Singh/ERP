import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.security import create_access_token, hash_password
from app.db.session import Base, get_db
from app.main import app
from app.models.user import User


TEST_DATABASE_URL = "sqlite+pysqlite:///:memory:"

engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def _override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = _override_get_db


@pytest.fixture(scope="function")
def db_session() -> Session:
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session: Session):
    # Keep test DB lifecycle tied to db_session fixture.
    _ = db_session
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture(scope="function")
def admin_user(db_session: Session) -> User:
    user = User(
        name="Test Admin",
        email="admin@test.local",
        password=hash_password("admin12345"),
        role="admin",
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture(scope="function")
def faculty_user(db_session: Session) -> User:
    user = User(
        name="Test Faculty",
        email="faculty@test.local",
        password=hash_password("faculty12345"),
        role="faculty",
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture(scope="function")
def student_user(db_session: Session) -> User:
    user = User(
        name="Test Student",
        email="student@test.local",
        password=hash_password("student12345"),
        role="student",
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture(scope="function")
def auth_headers(admin_user: User) -> dict[str, str]:
    token = create_access_token({"user_id": admin_user.id, "role": admin_user.role})
    return {"Authorization": f"Bearer {token}"}
