import os
from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from jose import JWTError, jwt

from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token
)

router = APIRouter()
ALGORITHM = os.getenv("ALGORITHM", "HS256")
SECRET_KEY = os.getenv("SECRET_KEY", "change-me")


def serialize_user(user: User):
    return {
        "id": str(user.id),
        "email": user.email,
        "name": user.name,
        "role": user.role,
        "isActive": True,
        "createdAt": "",
        "updatedAt": ""
    }


@router.post("/register")
def register_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    hashed = hash_password(
        user.password
    )

    new_user = User(
        name=user.name,
        email=user.email,
        password=hashed,
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "success": True,
        "message": "User created",
        "data": serialize_user(new_user)
    }


@router.post("/login")
def login_user(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    db_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not verify_password(
        user.password,
        db_user.password
    ):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(
        {
            "user_id": db_user.id,
            "role": db_user.role
        }
    )

    return {
        "accessToken": token,
        "refreshToken": token,
        "user": serialize_user(db_user)
    }


@router.get("/me")
def get_me(
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing authorization header")

    token = authorization.split(" ", 1)[1]

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
    except JWTError as exc:
        raise HTTPException(status_code=401, detail="Invalid token") from exc

    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return serialize_user(user)


@router.post("/refresh")
def refresh_token(payload: dict):
    refresh_token_value = payload.get("refreshToken")
    if not refresh_token_value:
        raise HTTPException(status_code=400, detail="refreshToken is required")

    return {
        "accessToken": refresh_token_value,
        "refreshToken": refresh_token_value
    }


@router.post("/logout")
def logout_user():
    return {
        "success": True
    }