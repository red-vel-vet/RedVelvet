// /hosts/Profile.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import addPhoto from '../../assets/icons/add_photo.svg';
import styles from '../../styles/HostProfile.module.css';

function Profile() {
  const navigate = useNavigate();
  const [hostData, setHostData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // On mount, load the user’s Host record, if any
  useEffect(() => {
    fetchHostData();
  }, []);

  const fetchHostData = async () => {
    try {
      // Attempt to fetch the user’s existing Host(s). 
      // For a 1-to-1 relationship, we'll get either an empty array or an array with 1 object.
      const res = await api.get('/api/user-hosts/');
      if (res.data.length === 0) {
        // No existing host => user can create a new one
        // Initialize fields as blank
        setHostData({
          name: '',
          tagline: '',
          description: '',
          email: '',
          phone: '',
        });
      } else {
        // Found existing host data
        setHostData(res.data[0]);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to load host data.');
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setHostData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      // If no host ID present, create a new host
      if (!hostData.id) {
        const createRes = await api.post('/api/hosts/create/', hostData);
        setHostData(createRes.data);
        alert('Host profile created successfully!');
      } else {
        // If we have an existing host (hostData.id), update it via PATCH or PUT
        const updateUrl = `/api/hosts/update/${hostData.id}/`;
        const updateRes = await api.patch(updateUrl, hostData);
        setHostData(updateRes.data);
        alert('Host profile updated!');
      }
    } catch (err) {
      console.error(err);
      setError('Error saving host profile.');
    }
  };

  if (loading) {
    return <div>Loading host profile...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!hostData) {
    // This scenario is unlikely if 'loading' is false and 'error' is false,
    // but we can handle it gracefully.
    return <div>No host data available.</div>;
  }

  return (
    <div className={styles.hostProfileContainer}>
      <h2 className={styles.title}>Host Profile</h2>

      <div className={styles.logoContainer}>
        <img
          src={addPhoto}
          alt="Add Host Logo"
          className={styles.hostLogo}
        />
        {/* Future: Onclick => open file picker or a separate modal for uploading. */}
      </div>

      <div className={styles.formContainer}>
        <label className={styles.label}>
          Name
          <input
            name="name"
            type="text"
            value={hostData.name || ''}
            onChange={handleChange}
            className={styles.input}
          />
        </label>

        <label className={styles.label}>
          Tagline
          <input
            name="tagline"
            type="text"
            value={hostData.tagline || ''}
            onChange={handleChange}
            className={styles.input}
          />
        </label>

        <label className={styles.label}>
          Description
          <textarea
            name="description"
            value={hostData.description || ''}
            onChange={handleChange}
            rows={5}
            className={styles.textarea}
          />
        </label>

        <label className={styles.label}>
          Email
          <input
            name="email"
            type="email"
            value={hostData.email || ''}
            onChange={handleChange}
            className={styles.input}
          />
        </label>

        <label className={styles.label}>
          Phone
          <input
            name="phone"
            type="text"
            value={hostData.phone || ''}
            onChange={handleChange}
            className={styles.input}
          />
        </label>
      </div>

      <button className={styles.saveButton} onClick={handleSave}>
        Save
      </button>
    </div>
  );
}

export default Profile;