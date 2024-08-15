import React, { useState, useEffect } from 'react';
import api from '../api';
import logo from '../assets/images/token.png';
import CategoryItem from '../components/CategoryItem';
import '../styles/Quiz.css';

function Quiz() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userResponses, setUserResponses] = useState([]);

  useEffect(() => {
    const fetchCategoriesAndQuestions = async () => {
      try {
        setIsLoading(true);
        const [categoryResponse, questionResponse, responseResponse] = await Promise.all([
          api.get('/api/quiz-categories/'),
          api.get('/api/quiz-questions/'),
          api.get('/api/user-responses/')
        ]);

        const categories = categoryResponse.data;
        const questions = questionResponse.data;
        const responses = responseResponse.data;

        setUserResponses(responses);

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

    fetchCategoriesAndQuestions();
  }, []);

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
      <h2 className="quiz-title">SEXUAL INTERESTS QUIZ</h2>
      <div className="category-list">
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

export default Quiz;