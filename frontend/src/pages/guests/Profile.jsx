import React, { useState, useEffect } from 'react';
import api from '../../api'; 
import EditableSection from '../../components/EditableSection';
import addPhoto from '../../assets/icons/add_photo.svg';
import EditProfileHeaderModal from '../../components/EditProfileHeaderModal';
import styles from '../../styles/Profile.module.css';

function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const profileResponse = await api.get('/api/user/profile/');
        setProfileData(profileResponse.data);

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

  const handleSave = async (updatedData) => {
    try {
      const response = await api.put('/api/user/profile/', updatedData);
      setProfileData(response.data);
      setIsModalOpen(false);
    } catch {
      setError('Failed to save profile details');
    }
  };

  const handleSaveSection = (section, text) => {
    api.put('/api/user/profile/', { ...profileData, [section]: text })
      .then(() => {
        setProfileData((prevData) => ({ ...prevData, [section]: text }));
      })
      .catch(() => {
        setError('Failed to save profile data');
      });
  };

  if (loading) {
    return <div>Loading profile data...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!profileData) {
    return <div>No profile data available</div>;
  }

  const {
    age_display_value,
    gender,
    sexuality_display,
    about_you,
    relationship_status,
    personal_background,
    experience,
    community_contribution,
    philosophy_views,
    fantasy_preferences,
  } = profileData;

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader} onClick={() => setIsModalOpen(true)}>
        <h2>{username}</h2>
        <h3>
          {age_display_value} | {gender.replace(/_/g, ' ')} | {sexuality_display}
        </h3>
      </div>
      <EditProfileHeaderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        profileData={{ ...profileData, username }}
      />
      <div className={styles.profileImages}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className={styles.profileImage}>
            <img src={addPhoto} alt={`Add Photo ${index + 1}`} />
          </div>
        ))}
      </div>

      <div className={styles.profileDetails}>
        <EditableSection
          title="About You"
          content={about_you}
          placeholder="Summarize yourself in a short description"
          isTextarea={true}
          maxLength={500}
          onSave={(text) => handleSaveSection('about_you', text)}
        />

        <h3>Application Details</h3>
        <p>The following responses are only visible to hosts when you apply for membership and are not visible to other members.</p>

        <EditableSection
          title="Relationship Status"
          content={relationship_status}
          placeholder="Describe your relationship status"
          isTextarea={true}
          maxLength={500}
          onSave={(text) => handleSaveSection('relationship_status', text)}
        />

        <EditableSection
          title="Background, Interests, & Hobbies"
          content={personal_background}
          placeholder="Describe your background, interests, and hobbies"
          isTextarea={true}
          maxLength={500}
          onSave={(text) => handleSaveSection('personal_background', text)}
        />

        <EditableSection
          title="Sex-Positive Event Experience"
          content={experience}
          placeholder="Describe your experience with sex-positive events"
          isTextarea={true}
          maxLength={500}
          onSave={(text) => handleSaveSection('experience', text)}
        />

        <EditableSection
          title="Community Contribution"
          content={community_contribution}
          placeholder="Describe how you contribute to the community"
          isTextarea={true}
          maxLength={500}
          onSave={(text) => handleSaveSection('community_contribution', text)}
        />

        <EditableSection
          title="Philosophy on Sex"
          content={philosophy_views}
          placeholder="Describe your personal philosophy on sex"
          isTextarea={true}
          maxLength={500}
          onSave={(text) => handleSaveSection('philosophy_views', text)}
        />

        <EditableSection
          title="Sexual Fantasies"
          content={fantasy_preferences}
          placeholder="Describe your ideal fantasy"
          isTextarea={true}
          maxLength={500}
          onSave={(text) => handleSaveSection('fantasy_preferences', text)}
        />
      </div>
    </div>
  );
}

export default Profile;
