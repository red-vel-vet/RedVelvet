import React, { useState, useEffect } from 'react';
import api from '../api';
import Button from './Button';
import '../styles/ProfileDetails.css';

const ProfileDetails = ({ userProfile, onSave, onClose }) => {
  const [profileData, setProfileData] = useState({
    first_name: userProfile.first_name || '',
    last_name: userProfile.last_name || '',
    gender: userProfile.gender || 'CIS_M',
    sexuality: userProfile.sexuality || 'STRAIGHT',
    age_display: userProfile.age_display || 'NUMBER',
  });

  const [authData, setAuthData] = useState({ username: '', email: '' });

  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        const response = await api.get('/api/user/view/');
        setAuthData({
          username: response.data.username,
          email: response.data.email,
        });
      } catch (error) {
        console.error("Failed to load user authentication data", error);
      }
    };

    fetchAuthData();
  }, []);

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getGeneration = (dob) => {
    const year = new Date(dob).getFullYear();
    if (year <= 1924) return 'Greatest Generation';
    if (year >= 1925 && year <= 1945) return 'Silent Generation';
    if (year >= 1946 && year <= 1964) return 'Baby Boomer';
    if (year >= 1965 && year <= 1976) return 'Gen X';
    if (year >= 1977 && year <= 1983) return 'Xennial';
    if (year >= 1984 && year <= 1994) return 'Millennial';
    if (year >= 1995 && year <= 2012) return 'Gen Z';
    return 'Gen Alpha';
  };

  const getAgeRange = (age) => {
    return `${Math.floor(age / 10) * 10}s`;
  };

  const dob = userProfile.dob || '';
  const age = calculateAge(dob);
  const generation = getGeneration(dob);
  const ageRange = getAgeRange(age);

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(profileData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="category-title">PROFILE INFORMATION</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              className="form-input"
              type="text"
              value={authData.username}
              disabled
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              className="form-input"
              type="email"
              value={authData.email}
              disabled
            />
          </div>
          <div className="form-group">
            <label>First Name</label>
            <input
              className="form-input"
              type="text"
              name="first_name"
              value={profileData.first_name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              className="form-input"
              type="text"
              name="last_name"
              value={profileData.last_name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Age Display</label>
            <select
              className="form-input"
              name="age_display"
              value={profileData.age_display}
              onChange={handleChange}
            >
              <option value="NUMBER">{age}</option>
              <option value="GENERATION">{generation}</option>
              <option value="RANGE">{ageRange}</option>
              <option value="NONE">None</option>
            </select>
          </div>
          <div className="form-group">
            <label>Gender</label>
            <select
              className="form-input"
              name="gender"
              value={profileData.gender}
              onChange={handleChange}
            >
              <option value="CIS_M">CIS M</option>
              <option value="CIS_F">CIS F</option>
              <option value="TRANS_M">Trans M</option>
              <option value="TRANS_F">Trans F</option>
              <option value="NON_BINARY">Non-Binary</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Sexual Preference</label>
            <select
              className="form-input"
              name="sexuality"
              value={profileData.sexuality}
              onChange={handleChange}
            >
              <option value="STRAIGHT">Straight</option>
              <option value="HETERO">Heteroflexible</option>
              <option value="BI_CURIOUS">Bi-curious</option>
              <option value="BISEXUAL">Bisexual</option>
              <option value="HOMO">Homoflexible</option>
              <option value="GAY">Gay/Lesbian</option>
              <option value="OTHER">Other</option>
            </select>
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

export default ProfileDetails;