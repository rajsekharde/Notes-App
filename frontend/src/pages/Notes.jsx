import React, { useState, useEffect } from "react";
import "./Notes.css";
import testDb from "./testDB"
import NoteModal from "../components/NoteModal";
import CreateNoteModal from "../components/CreateNoteModal";

const BASE_URL = import.meta.env.VITE_API_URL;

function Notes() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedNote, setSelectedNote] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    function truncate(text, maxLength) {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    async function getNotes() {
        const response = await fetch(`${BASE_URL}/notes/`);
        if (!response.ok) {
            console.error("Error fetching notes");
            setLoading(false);
            setNotes(testDb);
            return;
        }
        const data = await response.json();
        const sortedNotes = [...data].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        setNotes(sortedNotes);
        setLoading(false);
    }

    const handleUpdateNote = (updatedNote) => {
        setNotes(prev =>
            prev.map(n => (n.id === updatedNote.id ? updatedNote : n))
        );
        setSelectedNote(updatedNote);
    };

    const handleDeleteNote = async (id) => {
        await fetch(`${BASE_URL}/notes/${id}`, { method: "DELETE" });
        setNotes(prev => prev.filter(n => n.id !== id));
        setSelectedNote(null);
    };


    useEffect(() => {
        getNotes();
    }, []);

    const handleCreateNote = (newNote) => {
        setNotes([newNote, ...notes]);
    };

    if (loading)
        return (
            <div id="loadingDiv">
                <h2 id="loadingHeading">Loading...</h2>
            </div>
        )

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
            <button
                className="floatingButton"
                onClick={() => setShowCreateModal(true)}>
                +
            </button>

            {showCreateModal && (
                <CreateNoteModal
                    onClose={() => setShowCreateModal(false)}
                    onCreate={handleCreateNote}
                />
            )}

            {selectedNote && (
                <NoteModal
                    note={selectedNote}
                    onClose={() => setSelectedNote(null)}
                    onUpdate={handleUpdateNote}
                    onDelete={handleDeleteNote}
                />
            )}
        </div>
    );
}

export default Notes