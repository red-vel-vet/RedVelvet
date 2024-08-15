import React, { useState } from 'react';
import CategoryDetails from './CategoryDetails';
import '../styles/CategoryItem.css';

const CategoryItem = ({ category, userResponses, onSave }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <div className="category-item" onClick={toggleExpand}>
        <h3 className="category-name">{category.name.toUpperCase()}</h3>
        <p className="category-description">{category.description}</p>
      </div>

      {isExpanded && (
        <CategoryDetails 
          category={category} 
          userResponses={userResponses}  // Pass down userResponses
          onClose={toggleExpand} 
          onSave={onSave}
        />
      )}
    </>
  );
};

export default CategoryItem;