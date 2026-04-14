from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User


def require_role(role: str):

    def role_checker(
        user_id: int,
        db: Session = Depends(get_db)
    ):

        user = db.query(User).filter(
            User.id == user_id
        ).first()

        if not user:

            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        if user.role != role:

            raise HTTPException(
                status_code=403,
                detail="Permission denied"
            )

        return user

    return role_checker