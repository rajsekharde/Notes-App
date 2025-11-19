import React, { useEffect, useState } from "react";
const BASE_URL = import.meta.env.VITE_API_URL;

function NotesTemp() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    async function getNotes() {
        const response = await fetch(`${BASE_URL}/notes/`);
        if(!response.ok) {
            console.error("Error fetching notes");
            setLoading(false);
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
        return <p>Loading...</p>
    
    return (
        <div id="notesList">
        <h1>Notes</h1>
            {
                notes.map((note) => (
                    <div id="noteContainer" key={note.id}>
                        <h3>{note.title}</h3>
                        <p>{note.content}</p>
                        <small>
                            Created: {new Date(note.created_at).toLocaleString()}
                            <br/>
                            Updated: {new Date(note.updated_at).toLocaleString()}
                        </small>
                    </div>
                ))
            }
        </div>
    );

}

export default NotesTemp;