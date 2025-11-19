import React, { useState, useEffect } from "react";
import "./Notes.css";
import NoteModal from "../components/NoteModal";
import testDb from "./testDB"

const BASE_URL = import.meta.env.VITE_API_URL;

function Notes() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedNote, setSelectedNote] = useState(null);

    function truncate(text, maxLength) {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    async function getNotes() {
        const response = await fetch(`${BASE_URL}/notes/`);
        if(!response.ok) {
            console.error("Error fetching notes");
            setLoading(false);
            setNotes(testDb);
            return;
        }
        const data = await response.json();
        setNotes(data);
        setLoading(false);
    }

    useEffect(() => {
        getNotes();
    }, []);

    if(loading)
        return <h2>Loading...</h2>

    return (
        <div id="pageContainer">
            <header className="pageHeader">
                <h1 className="pageTitle">Notes App</h1>
            </header>
            <div id="notesGridDiv">
                {notes.map((note) => (
                    <div
                        key={note.id}
                        className="notesCard"
                        onClick={() => setSelectedNote(note)}>
                        <h3>{truncate(note.title, 10)}</h3>
                        <p>{truncate(note.content, 20)}</p>
                        <small>
                            Created: {new Date(note.created_at).toLocaleString()}
                            <br />
                            Updated: {new Date(note.updated_at).toLocaleString()}
                        </small>
                    </div>
                ))}
            </div>
            {
                selectedNote && (
                    <NoteModal note={selectedNote} onClose={() => setSelectedNote(null)} />
                )
            }
        </div>
    );
}

export default Notes