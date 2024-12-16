import React, { useState } from 'react';
import styles from '../styles/EditProfileSection.module.css';
import pencil from '../assets/icons/pencil.svg';
import Button from './Button';

function EditableSection({ title, content, onSave, placeholder, maxLength }) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(content || '');

  const handleSave = () => {
    onSave(text);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setText(content); 
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h4>{title}</h4>
        {!isEditing && (
          <img
            src={pencil}
            alt={`Edit ${title}`}
            className={styles.pencil}
            onClick={() => setIsEditing(true)}
          />
        )}
      </div>
      {isEditing ? (
        <div className={styles.edit}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
            className={styles.textarea}
            maxLength={maxLength}
          />
          <div className={styles.charCount}>
            {text.length}/{maxLength}
          </div>
          <div className={styles.buttonContainer}>
            <Button className="button cancel" onClick={handleCancel}>Cancel</Button>
            <Button className="button submit" onClick={handleSave}>Save</Button>
          </div>
        </div>
      ) : (
        <p className={styles.content}>{content || placeholder}</p>
      )}
    </div>
  );
}

export default EditableSection;