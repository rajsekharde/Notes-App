from sqlmodel import SQLModel
from typing import Optional
from datetime import datetime

# Note Models

class NoteBase(SQLModel):
    title: str
    content: str

class NoteCreate(NoteBase):
    pass

class NoteRead(NoteBase):
    id: int
    created_at: datetime
    updated_at: datetime

class NoteUpdate(SQLModel):
    title: Optional[str] = None
    content: Optional[str] = None

# User Models

class UserCreate(SQLModel):
    email: str
    password: str

class UserRead(SQLModel):
    id: int
    email: str
    is_admin: bool

class UserLogin(SQLModel):
    email: str
    password: str

# Token used in responses for login, refresh

class Token(SQLModel):
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"