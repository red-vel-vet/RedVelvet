import React, { useState, useEffect } from "react";
import { FaThumbsDown, FaMeh, FaThumbsUp, FaHeart } from "react-icons/fa";
import "../styles/QuestionItem.css";

const QuestionItem = ({ question, initialRating, onRatingChange }) => {
  const [selectedRating, setSelectedRating] = useState(initialRating || 2); // Default to Neutral (2)

  useEffect(() => {
    setSelectedRating(initialRating || 2);
  }, [initialRating]);

  const handleRatingClick = (rating) => {
    setSelectedRating(rating);
    if (onRatingChange) {
      onRatingChange(rating);
    }
  };

  return (
    <div className="question-item">
      <p className="question-text">{question.text}</p>
      <div className="rating-icons">
        <FaThumbsDown
          className={`rating-icon ${selectedRating === 1 ? 'selected' : ''}`}
          onClick={() => handleRatingClick(1)}
        />
        <FaMeh
          className={`rating-icon ${selectedRating === 2 ? 'selected' : ''}`}
          onClick={() => handleRatingClick(2)}
        />
        <FaThumbsUp
          className={`rating-icon ${selectedRating === 3 ? 'selected' : ''}`}
          onClick={() => handleRatingClick(3)}
        />
        <FaHeart
          className={`rating-icon ${selectedRating === 4 ? 'selected' : ''}`}
          onClick={() => handleRatingClick(4)}
        />
      </div>
    </div>
  );
};

export default QuestionItem;