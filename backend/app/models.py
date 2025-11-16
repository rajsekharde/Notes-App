from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime, timezone

def now_utc():
    return datetime.now(timezone.utc)

class NoteBase(SQLModel):
    title: str
    content: str

class Note(NoteBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: Optional[datetime] = Field(
        default_factory=now_utc,
        sa_column_kwargs={"onupdate": now_utc}
    )
