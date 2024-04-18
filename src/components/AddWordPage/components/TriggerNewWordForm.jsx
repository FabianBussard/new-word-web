// TriggerNewWordForm.jsx
// Triggers input form on click

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import NewWordForm from './NewWordForm'; // Corrected import statement

function TriggerNewWordForm({ onNewWordSubmit }) {
  const [showForm, setShowForm] = useState(false);

  const handleButtonClick = () => {
    setShowForm(true);
  };

  return (
    <div className='trigger-new-word-form'>
      {showForm && (
        <NewWordForm onNewWordSubmit={(newWord, newDefinition) => {
          onNewWordSubmit(newWord, newDefinition);
          setShowForm(false);
        }} />
      )}
      <hr className="trigger-new-word-form-line" /> {/* Thin line */}
      <button className='trigger-new-word-form-button' onClick={handleButtonClick}>
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/e69892e7be0cec680168828a8ec1332e3ce10ac5e9c983585b4a51ea3cdff219?apiKey=f26453df6e5c43b6bfc2cda86201a2b9&"
        className="trigger-new-word-form-img"
        alt="Descriptive alternative text for the image"
      /> 
        <p className="trigger-new-word-form-text">New word</p>
      </button>
    </div>
  );
}

export default TriggerNewWordForm;
