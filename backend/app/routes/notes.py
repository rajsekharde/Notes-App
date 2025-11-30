from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from typing import List
from fastapi import Depends, HTTPException, status
from app.auth_utils import get_current_user
from app.models import User

from app.crud import (
    create_note,
    get_note,
    read_notes,
    update_note,
    delete_note
)

from app.database import get_session
from app.schemas import NoteCreate, NoteRead, NoteUpdate
from app.models import Note, User

# APIRouter → Creates a group of endpoints (routes) for notes. Helps organize the API.
router = APIRouter(
    prefix="/notes", # all routes here start with /notes
    tags=["Notes"] # grouped in swagger docs for better organization
)


@router.post("/", response_model=NoteRead, status_code=201) # *
def create_note_endpoint(
    note: NoteCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    return create_note(note, session, current_user.id)


@router.get("/", response_model=List[NoteRead])
def read_notes_endpoint(
    session: Session = Depends(get_session),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user)
):
    return read_notes(session, current_user.id, skip, limit)


@router.patch("/{note_id}", response_model=NoteRead) # **
def update_note_endpoint(
    note_id: int,
    note: NoteUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    db_note = get_note(session, note_id)
    if not db_note:
        raise HTTPException(
            status_code=404,
            detail="Note not found"
        )
    if db_note.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to modify this note")
    
    return update_note(note, db_note, session, current_user.id)


@router.delete("/{note_id}", status_code=204)
def delete_note_endpoint(
    note_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    db_note = get_note(session, note_id)
    if not db_note:
        raise HTTPException(
            status_code=404,
            detail="Note not found"
        )
    if db_note.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to modify this note")
    
    delete_note(db_note, session, current_user.id)
    return

"""
*
@router.post("/") → HTTP POST at /notes/.
response_model=NoteRead → Response is validated and serialized with NoteRead schema.
status_code=201 → Standard “Created” HTTP response.
note: NoteCreate → Request body must match NoteCreate schema.
session: Session = Depends(get_session) → FastAPI injects a database session.
return create_note(note, session) → Calls CRUD function to save to DB and returns the saved note.

**
PATCH - used for partial updates, only specified fields get changed.
PUT - full replace. passing all field values is mandatory and all of them get changed.
@router.patch("/{note_id}") → HTTP PATCH at /notes/{note_id} (partial update).
note_id: int → Path parameter, the ID of the note to update.
note: NoteUpdate → Request body with fields to update.
session: Session = Depends(get_session) → Inject DB session.
db_note = get_note(session, note_id) → Fetch note from DB.
if not db_note: raise HTTPException(404) → Return 404 if note does not exist.
return update_note(...) → Calls CRUD function to update DB record and returns updated note.


"""