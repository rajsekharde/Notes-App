import React, { useState, useEffect } from "react";
import { useRef } from "react";
import "./Notes.css";
import testDb from "./testDB"
import NoteModal from "../components/NoteModal";
import CreateNoteModal from "../components/CreateNoteModal"
import { logoutUser, fetchMe, isLoggedIn, authFetch } from "../auth/auth";

// test

const BASE_URL = import.meta.env.VITE_API_URL;

function Notes() {
    const initialized = useRef(false);

    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedNote, setSelectedNote] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [authReady, setAuthReady] = useState(false);

    function truncate(text, maxLength) {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    async function getNotes() {
        const response = await authFetch(`${BASE_URL}/notes/`);
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
        await authFetch(`${BASE_URL}/notes/${id}`, { method: "DELETE" });
        setNotes(prev => prev.filter(n => n.id !== id));
        setSelectedNote(null);
    };


    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        async function initialize() {
            try {
                if (!isLoggedIn()) {
                    logoutUser();
                    return;
                }

                const user = await fetchMe();
                setIsAdmin(user.is_admin === true);

                const res = await authFetch(`${BASE_URL}/notes/`);
                const data = await res.json();

                const sorted = [...data].sort(
                    (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
                );

                setNotes(sorted);

            } catch (err) {
                console.error("Auth failed:", err);
                logoutUser();

            } finally {
                setLoading(false); // 🔥 finally always runs
            }
        }

        initialize();
    }, []);




    if (!authReady) {
        return (
            <div id="loadingDiv">
                <h2 id="loadingHeading">Loading...</h2>
            </div>
        );
    }


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

                <div style={{ display: "flex", gap: "12px" }}>
                    {isAdmin && (
                        <button
                            className="floatingButton"
                            style={{ position: "relative", width: "auto", padding: "6px 12px" }}
                            onClick={() => (window.location.href = "/admin")}
                        >
                            Admin
                        </button>
                    )}

                    <button
                        className="floatingButton"
                        style={{ position: "relative", width: "auto", padding: "6px 12px" }}
                        onClick={logoutUser}
                    >
                        Logout
                    </button>
                </div>
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