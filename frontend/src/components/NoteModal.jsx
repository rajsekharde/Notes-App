import React, { useState } from 'react';
import './NoteModal.css';

const BASE_URL = import.meta.env.VITE_API_URL;

const NoteModal = ({ note, onClose, onUpdate, onDelete }) => {
  if (!note) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const saveChanges = async () => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      setError("Title and content cannot be empty.");
      return;
    }

    if (
      trimmedTitle === note.title.trim() &&
      trimmedContent === note.content.trim()
    ) {
      setIsEditing(false);
      setError(null);
      return;
    }

    const fieldsToUpdate = {};
    if (trimmedTitle !== note.title) fieldsToUpdate.title = trimmedTitle;
    if (trimmedContent !== note.content) fieldsToUpdate.content = trimmedContent;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/notes/${note.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fieldsToUpdate)
      });

      if (!response.ok) throw new Error("Failed to update note");

      const updated = await response.json();
      onUpdate(updated);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <button className="closeButton" onClick={onClose}>×</button>

        {/* VIEW MODE */}
        {!isEditing && (
          <>
            <h2>{note.title}</h2>
            <p>{note.content}</p>

            <div id='bottomDiv'>
              <small id='timestapmsSmall'>
                Created: {new Date(note.created_at).toLocaleString()} <br />
                Updated: {new Date(note.updated_at).toLocaleString()}
              </small>
              <div id='buttonsDiv'>
                <button className='editButton' onClick={() => setIsEditing(true)}>Edit</button>
                <button className='deleteButton' onClick={() => onDelete(note.id)}>Delete</button>
              </div>
            </div>
          </>
        )}

        {/* EDIT MODE */}
        {isEditing && (
          <div id='editingDiv'>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Title'
              required
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder='Content'
              rows={6}
              required
            />

            {error && <p style={{ color: "red" }}>{error}</p>}

            <div id="editButtonsDiv">
              <button
                className='editButton'
                onClick={saveChanges}
                disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </button>

              <button
                className='deleteButton'
                onClick={() => {
                  setIsEditing(false);
                  setTitle(note.title);
                  setContent(note.content);
                  setError(null);
                }}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteModal;
