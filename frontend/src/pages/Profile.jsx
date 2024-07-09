// pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import api from '../api';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/Form.css';

function Profile() {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/user/profile/')
      .then((res) => setProfile(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    api.put('/api/user/profile/', profile)
      .then((res) => setProfile(res.data))
      .finally(() => setLoading(false));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form-container">
        <p className="form-title">Profile</p>
        <div className="form-group">
          <input
            className="form-input"
            type="text"
            name="first_name"
            value={profile.first_name || ''}
            onChange={handleChange}
            placeholder="First Name"
            readOnly={profile.first_name !== ''}
          />
        </div>
        <div className="form-group">
          <input
            className="form-input"
            type="text"
            name="last_name"
            value={profile.last_name || ''}
            onChange={handleChange}
            placeholder="Last Name"
            readOnly={profile.last_name !== ''}
          />
        </div>
        <div className="form-group">
          <input
            className="form-input"
            type="date"
            name="dob"
            value={profile.dob || ''}
            onChange={handleChange}
            placeholder="Date of Birth"
            readOnly={profile.dob !== ''}
          />
        </div>
        <div className="form-group">
          <select
            className="form-input"
            name="age_display"
            value={profile.age_display || ''}
            onChange={handleChange}
          >
            <option value="NUMBER">Number</option>
            <option value="GENERATION">Generation</option>
            <option value="RANGE">Range</option>
            <option value="NONE">None</option>
          </select>
        </div>
        <div className="form-group">
          <select
            className="form-input"
            name="gender"
            value={profile.gender || ''}
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
          <select
            className="form-input"
            name="sexuality"
            value={profile.sexuality || ''}
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
        <div className="form-group">
          <textarea
            className="form-input"
            name="about_you"
            value={profile.about_you || ''}
            onChange={handleChange}
            placeholder="Describe yourself in a few sentences..."
          />
        </div>
        <div className="form-group">
          <textarea
            className="form-input"
            name="relationship_status"
            value={profile.relationship_status || ''}
            onChange={handleChange}
            placeholder="Tell us about your relationship status..."
          />
        </div>
        <div className="form-group">
          <textarea
            className="form-input"
            name="personal_background"
            value={profile.personal_background || ''}
            onChange={handleChange}
            placeholder="Tell us about yourself..."
          />
        </div>
        <div className="form-group">
          <textarea
            className="form-input"
            name="experience"
            value={profile.experience || ''}
            onChange={handleChange}
            placeholder="Tell us about your experience with erotic parties and events..."
          />
        </div>
        <div className="form-group">
          <textarea
            className="form-input"
            name="community_contribution"
            value={profile.community_contribution || ''}
            onChange={handleChange}
            placeholder="Why are you interested in joining, and what positive traits or skills will you bring to the community?"
          />
        </div>
        <div className="form-group">
          <textarea
            className="form-input"
            name="philosophy_views"
            value={profile.philosophy_views || ''}
            onChange={handleChange}
            placeholder="What is your philosophy on sex, and what role does sexuality play in your life?"
          />
        </div>
        <div className="form-group">
          <textarea
            className="form-input"
            name="fantasy_preferences"
            value={profile.fantasy_preferences || ''}
            onChange={handleChange}
            placeholder="Describe your ideal night at an erotic party and what most turns you on..."
          />
        </div>
        <div className="button-container">
          <Button className="button submit" type="submit">Save</Button>
        </div>
      </form>
    </div>
  );
}

export default Profile;