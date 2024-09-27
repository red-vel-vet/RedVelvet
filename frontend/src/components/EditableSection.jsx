import React, { useState } from 'react';
import pencil from '../assets/icons/pencil.svg';
import Button from './Button';

function EditableSection({ title, content, onSave, placeholder }) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(content || '');

  const handleSave = () => {
    onSave(text);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setText(content); // Reset the text to the original content
  };

  return (
    <div className="editable-section-container">
      <div className="editable-section-header">
        <h4>{title}</h4>
        {!isEditing && (
          <img
            src={pencil}
            alt={`Edit ${title}`}
            className="pencil-icon"
            onClick={() => setIsEditing(true)}
          />
        )}
      </div>
      {isEditing ? (
        <div className="editable-section-edit">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
            className="editable-section-textarea"
          />
          <div className="button-container-small">
            <Button className="button cancel" onClick={handleCancel}>Cancel</Button>
            <Button className="button submit" onClick={handleSave}>Save</Button>
          </div>
        </div>
      ) : (
        <p>{content || placeholder}</p>
      )}
    </div>
  );
}

export default EditableSection;