import React, { useState } from 'react';
import QuestionItem from './QuestionItem';
import Button from './Button';
import '../styles/CategoryDetails.css';

const CategoryDetails = ({ category, onClose, onSave, userResponses = [] }) => {
  const [responses, setResponses] = useState(
    category.questions.map((question) => {
      const userResponse = userResponses.find((response) => response.question_id === question.id);
      return {
        question_id: question.id,
        response_value: userResponse ? userResponse.response_value : 2, // Neutral as default
        initial_value: userResponse ? userResponse.response_value : 2, // Track initial value
      };
    })
  );

  const handleRatingChange = (questionId, rating) => {
    setResponses((prevResponses) =>
      prevResponses.map((response) =>
        response.question_id === questionId
          ? { ...response, response_value: rating }
          : response
      )
    );
  };

  const handleSaveClick = () => {
    // Filter out responses that haven't changed
    const changedResponses = responses.filter(
      response => response.response_value !== response.initial_value
    );

    if (changedResponses.length > 0) {
      onSave(changedResponses);
    }
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="category-title">{category.name.toUpperCase()}</h3>
        <div className="category-questions">
          {category.questions.map((question) => (
            <QuestionItem
              key={question.id}
              question={question}
              initialRating={responses.find(
                (response) => response.question_id === question.id
              )?.response_value}
              onRatingChange={(rating) => handleRatingChange(question.id, rating)}
            />
          ))}
        </div>
        <div className="button-container">
          <Button className="button cancel" onClick={onClose}>
            Cancel
          </Button>
          <Button className="button submit" onClick={handleSaveClick}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetails;