// NoteModal.jsx
import React from 'react';
import './NoteModal.css';

const NoteModal = ({ note, onClose }) => {
  if (!note) return null; // Don't render if no note

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <button className="closeButton" onClick={onClose}>×</button>
        <h2>{note.title}</h2>
        <p>{note.content}</p>
        <small>
          Created: {new Date(note.created_at).toLocaleString()} <br />
          Updated: {new Date(note.updated_at).toLocaleString()}
        </small>
      </div>
    </div>
  );
};

export default NoteModal;
