from fastapi import APIRouter, Depends, HTTPException, status, Cookie, Response
from sqlmodel import Session, select
from datetime import timedelta
from typing import Annotated
from pydantic import BaseModel
from datetime import datetime

from app.database import get_session
from app.models import User, RefreshToken, now_utc, Note
from app.schemas import UserCreate, UserRead, UserLogin, Token, UserReadDashB
from app.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
    ACCESS_TOKEN_EXPIRE_MINS,
    REFRESH_TOKEN_EXPIRE_DAYS
)
from app.auth_utils import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])

class RefreshTokenRequest(BaseModel):
    refresh_token: str

# Register
@router.post("/register", response_model=UserRead)
def register(user: UserCreate, session: Session = Depends(get_session)):
    existing = session.exec(select(User).where(User.email == user.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = User(
        email=user.email,
        hashed_password=hash_password(user.password)
    )

    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    return new_user

# Login
@router.post("/login", response_model=UserRead)
def login(credentials: UserLogin, response: Response, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == credentials.email)).first()

    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid Credentials")

    access_token = create_access_token({"sub": str(user.id)})
    refresh_token = create_refresh_token({"sub": str(user.id)})

    # Store refresh token in DB as before
    token_obj = RefreshToken(
        user_id=user.id,
        token=refresh_token,
        expires_at=now_utc() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
    )
    session.add(token_obj)
    session.commit()

    # Set HTTP-only cookies
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        samesite="lax",
        max_age=ACCESS_TOKEN_EXPIRE_MINS * 60,
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        samesite="lax",
        max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 3600,
    )

    # Return basic user info, NOT tokens
    return UserRead.from_orm(user)

# Refresh Token
@router.post("/refresh", response_model=Token)
def refresh(
    response: Response,
    session: Session = Depends(get_session),
    refresh_token: str | None = Cookie(default=None),
):
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Missing refresh token")

    payload = decode_token(refresh_token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid Refresh Token")

    stored = session.exec(
        select(RefreshToken).where(RefreshToken.token == refresh_token)
    ).first()
    if not stored:
        raise HTTPException(status_code=401, detail="Token revoked or expired")

    new_access = create_access_token({"sub": payload["sub"]})

    # update access cookie
    response.set_cookie(
        key="access_token",
        value=new_access,
        httponly=True,
        samesite="lax",
        max_age=ACCESS_TOKEN_EXPIRE_MINS * 60,
    )

    return {
        "access_token": new_access,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


# Logout
@router.post("/logout")
def logout(
    response: Response,
    session: Session = Depends(get_session),
    refresh_token: str | None = Cookie(default=None),
):
    # Delete refresh token from DB if present
    if refresh_token:
        stored = session.exec(
            select(RefreshToken).where(RefreshToken.token == refresh_token)
        ).first()
        if stored:
            session.delete(stored)
            session.commit()

    # Clear cookies
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")

    return {"message": "Logged out successfully"}


@router.get("/me", response_model=UserRead)
def me(current_user: User = Depends(get_current_user)):
    return current_user



def require_admin(current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admins only")
    return current_user


@router.get("/users", response_model=list[UserReadDashB])
def get_users(
    session: Session = Depends(get_session),
    admin: User = Depends(require_admin)
):
    users = session.exec(select(User)).all()
    now = datetime.utcnow()

    results = []
    for u in users:
        active_tokens = session.exec(
            select(RefreshToken).where(
                RefreshToken.user_id == u.id,
                RefreshToken.expires_at > now
            )
        ).all()

        user_data = UserReadDashB(
            id=u.id,
            email=u.email,
            is_admin=u.is_admin,
            is_logged_in=len(active_tokens) > 0
        )
        results.append(user_data)

    return results

@router.post("/logout_user/{user_id}")
def logout_user(
    user_id: int,
    admin: User = Depends(require_admin),
    session: Session = Depends(get_session)
):
    tokens = session.exec(
        select(RefreshToken).where(RefreshToken.user_id == user_id)
    ).all()

    for t in tokens:
        session.delete(t)

    session.commit()
    return {"message": "User logged out everywhere"}


@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    admin: User = Depends(require_admin),
    session: Session = Depends(get_session)
):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    tokens = session.exec(
        select(RefreshToken).where(RefreshToken.user_id == user_id)
    ).all()
    for t in tokens:
        session.delete(t)
    
    notes = session.exec(
        select(Note).where(Note.user_id == user_id)
    ).all()
    for note in notes:
        session.delete(note)

    session.delete(user)
    session.commit()
    return {"message": "User deleted"}
