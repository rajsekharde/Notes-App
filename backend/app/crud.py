from fastapi import HTTPException
from app.schemas import NoteCreate, NoteRead, NoteUpdate
from app.models import Note
from sqlmodel import Session, select


def create_note(
        note: NoteCreate,
        session: Session,
        user_id: int
):
    db_note = Note(**note.model_dump(), user_id=user_id) # To convert pydantic schema to database model *
    session.add(db_note) # adds the new note to the database session (not yet written to DB)
    session.commit() # saves changes to the database
    session.refresh(db_note) # reloads the object from the database (gets auto-generated fields like id, created_at)
    return db_note


def get_note(session: Session, note_id: int) -> Note | None: # Returns Note object if found, otherwise None
    return session.get(Note, note_id)


def read_notes( # **
        session: Session,
        user_id: int,
        skip: int = 0,
        limit: int = 100
):
    notes = session.exec(select(Note).where(Note.user_id == user_id).offset(skip).limit(limit))
    return notes.all()


def update_note( # ***
        note: NoteUpdate,
        db_note: Note,
        session: Session,
        user_id: int
) -> Note:
    
    if db_note.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not your note")
    
    update_dict = note.model_dump(exclude_unset=True)
    for field, value in update_dict.items():
        setattr(db_note, field, value)
    session.add(db_note)
    session.commit()
    session.refresh(db_note)
    return db_note


def delete_note(
        db_note: Note,
        session: Session,
        user_id: int
):
    if db_note.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not your note")
    
    session.delete(db_note) # marks object for deletion
    session.commit() # removes object from database
    return True

"""
*
note.model_dump() - Converts Pydantic schema (NoteCreate) into a dictionary
    e.g., {"title": "Hello", "content": "World"}
Note(**...) - Uses dictionary unpacking to create a database model instance

**
Pagination:
    skip → number of rows to skip (for page offset)
    limit → max number of rows to return
select(Note) → build SQL query for all notes
session.exec(...) → execute query
.all() → return list of Note objects

***
note.model_dump(exclude_unset=True) - Converts NoteUpdate schema into dictionary.
exclude_unset=True → only includes fields the user actually provided (so you don’t overwrite unchanged fields with None).
Loop: for field, value in update_dict.items(): setattr(db_note, field, value)
    - Updates only the fields the user wants to change.
"""