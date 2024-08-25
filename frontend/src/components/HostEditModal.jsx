import React, { useState } from 'react';
import Button from './Button';
import '../styles/HostEditModal.css';

const HostEditModal = ({ host, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        tagline: host.tagline || '',
        email: host.email || '',
        description: host.description || '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3 className="category-title">Edit Host Information</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="tagline" className="form-label">Tagline</label>
                        <input
                            type="text"
                            id="tagline"
                            name="tagline"
                            value={formData.tagline}
                            onChange={handleChange}
                            className="form-input"
                            autoComplete="off"
                        />
                    </div>
                    {/* <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-input"
                            autoComplete="email"
                        />
                    </div> */}
                    <div className="form-group">
                        <label htmlFor="description" className="form-label">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="form-input"
                            autoComplete="off"
                        />
                    </div>
                    <div className="button-container">
                        <Button className="button cancel" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button className="button submit" type="submit">
                            Save
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HostEditModal;