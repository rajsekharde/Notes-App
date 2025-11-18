import React, { useEffect, useState } from "react";
const BASE_URL = import.meta.env.VITE_API_URL;

function Notes() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    async function getNotes() {
        const response = await fetch(`${BASE_URL}/notes/`);
        if(!response) {
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
        <>
        <h2>Notes</h2>
        </>
    )

}