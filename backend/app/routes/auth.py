from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from datetime import timedelta
from typing import Annotated

from app.database import get_session
from app.models import User, RefreshToken, now_utc
from app.schemas import UserCreate, UserRead, UserLogin, Token
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
@router.post("/login", response_model=Token)
def login(credentials: UserLogin, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == credentials.email)).first()

    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid Credentials")
    
    access_token = create_access_token({"sub": str(user.id)})
    refresh_token = create_refresh_token({"sub": str(user.id)})

    token_obj = RefreshToken(
        user_id=user.id,
        token=refresh_token,
        expires_at=now_utc() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    )

    session.add(token_obj)
    session.commit()

    return Token(
        access_token=access_token,
        refresh_token=refresh_token
    )

# Refresh Token
@router.post("/refresh", response_model=Token)
def refresh(refresh_token: str, session: Session = Depends(get_session)):
    payload = decode_token(refresh_token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid Refresh Token")

    stored = session.exec(select(RefreshToken).where(RefreshToken.token == refresh_token)).first()
    if not stored:
        raise HTTPException(status_code=401, detail="Token revoked or expired")

    new_access = create_access_token({"sub": payload["sub"]})

    return {
        "access_token": new_access,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


# Logout
@router.post("/logout")
def logout(refresh_token: str, session: Session = Depends(get_session)):
    stored = session.exec(select(RefreshToken).where(RefreshToken.token == refresh_token)).first()

    if stored:
        session.delete(stored)
        session.commit()
    
    return {"Message": "Logged out successfully"}

@router.get("/me", response_model=UserRead)
def me(current_user: User = Depends(get_current_user)):
    return current_user
