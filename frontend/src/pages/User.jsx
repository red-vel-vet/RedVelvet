import React, { useState, useEffect } from 'react';
import api from '../api';
import logo from '../assets/images/token.png';
import CategoryItem from '../components/CategoryItem';
import ProfileDetails from '../components/ProfileDetails';
import '../styles/User.css';

function UserInfo() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userResponses, setUserResponses] = useState([]);
  const [userProfile, setUserProfile] = useState({});
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [categoryResponse, questionResponse, responseResponse, profileResponse] = await Promise.all([
          api.get('/api/quiz-categories/'),
          api.get('/api/quiz-questions/'),
          api.get('/api/user-responses/'),
          api.get('/api/user/profile/')
        ]);

        const categories = categoryResponse.data;
        const questions = questionResponse.data;
        const responses = responseResponse.data;
        const profile = profileResponse.data;

        setUserResponses(responses);
        setUserProfile(profile);

        // Group questions by category
        const categoriesWithQuestions = categories.map(category => ({
          ...category,
          questions: questions.filter(question => question.category === category.id)
        }));

        setCategories(categoriesWithQuestions);
      } catch (error) {
        setError('Failed to load data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSaveProfile = async (updatedProfile) => {
    try {
      await api.put('/api/user/profile/', updatedProfile);
      setUserProfile(updatedProfile);
      setIsProfileOpen(false);
    } catch (error) {
      console.error("Failed to save profile", error);
    }
  };

  const handleSaveResponses = async (responses) => {
    try {
      const payload = responses.map(response => ({
        question_id: response.question_id,
        response_value: response.response_value,
      }));
  
      const response = await api.post('/api/user-responses/', payload);
      console.log("Responses saved successfully:", response.data);
  
      // Update the userResponses state with the latest responses
      setUserResponses(prevResponses => {
        const updatedResponses = [...prevResponses];
  
        responses.forEach(newResponse => {
          const index = updatedResponses.findIndex(r => r.question_id === newResponse.question_id);
          if (index !== -1) {
            updatedResponses[index] = newResponse;
          } else {
            updatedResponses.push(newResponse);
          }
        });
  
        return updatedResponses;
      });
  
    } catch (error) {
      console.error("Failed to save responses", error);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <img src={logo} alt="Loading..." className="loading-logo" />
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h2 className="quiz-title">USER INFORMATION</h2>
      <div className="category-list">
        {/* Profile Category */}
        <div className="category-item" onClick={() => setIsProfileOpen(!isProfileOpen)}>
          <h3 className="category-name">PROFILE INFORMATION</h3>
          <p className="category-description">Review and update personal details, such as username, name, sexual identity & preferences.</p>
        </div>

        {isProfileOpen && (
          <ProfileDetails 
            userProfile={userProfile}
            onClose={() => setIsProfileOpen(false)}
            onSave={handleSaveProfile}
          />
        )}

        {/* Other Categories */}
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            category={category}
            userResponses={userResponses}  // Pass down userResponses
            onSave={handleSaveResponses}
          />
        ))}
      </div>
    </div>
  );
}

export default UserInfo;