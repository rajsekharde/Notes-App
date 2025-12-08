from fastapi import Depends, HTTPException, status, Cookie
from sqlmodel import Session, select
from app.security import decode_token
from app.models import User
from app.database import get_session

def get_current_user(
    access_token: str | None = Cookie(default=None),
    session: Session = Depends(get_session)
) -> User:
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    payload = decode_token(access_token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_id = int(payload["sub"])
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user
