import React, { useState, useEffect } from 'react';
import api from '../../api'; // Assuming you have an API utility for making requests
import '../../styles/Profile.css'; // Assuming you'll style it
import addPhoto from '../../assets/icons/add_photo.svg';

function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the user's profile data and username when the component loads
    const fetchProfileData = async () => {
      try {
        // Fetch profile data
        const profileResponse = await api.get('/api/user/profile/');
        setProfileData(profileResponse.data);

        // Fetch username from the User model
        const userResponse = await api.get('/api/user/view/');
        setUsername(userResponse.data.username);
      } catch (err) {
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return <div>Loading profile data...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!profileData) {
    return <div>No profile data available</div>;
  }

  // Destructure profileData for easy access
  const {
    age_display_value,
    gender,
    sexuality,
    about_you,
    relationship_status,
    personal_background,
    experience,
    community_contribution,
    philosophy_views,
    fantasy_preferences,
  } = profileData;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>{username}</h1>
        <h2>{age_display_value}  |  {gender.replace(/_/g, ' ')}  |  {sexuality.charAt(0) + sexuality.slice(1).toLowerCase()}</h2>
      </div>
      <div className="profile-images">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="profile-image">
            <img src={addPhoto} alt={`Add Photo ${index + 1}`} />
          </div>
        ))}
      </div>
      <div className="profile-details">
        <h3>About You</h3>
        <p>{about_you || 'This is a brief description of what the person wants you to know about them. It should be very brief because we want to encourage in-person interactions. Quick look and first impression is all that we care about. Basically, summarize yourself in a Thread because Twitter is dead.'}</p>
        <h3>Application Details</h3>
        <p>The following responses are only visible to hosts when you apply for membership and are not visible to other members.</p>
        <h4>Relationship Status</h4>
        <p>{relationship_status || 'Not provided'}</p>
        <h4>Personal Background</h4>
        <p>{personal_background || 'Not provided'}</p>
        <h4>Experience</h4>
        <p>{experience || 'Not provided'}</p>
        <h4>Community Contribution</h4>
        <p>{community_contribution || 'Not provided'}</p>
        <h4>Philosophy Views</h4>
        <p>{philosophy_views || 'Not provided'}</p>
        <h4>Fantasy Preferences</h4>
        <p>{fantasy_preferences || 'Not provided'}</p>
      </div>
    </div>
  );
}

export default Profile;