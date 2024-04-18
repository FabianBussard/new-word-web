import React, { useState } from 'react';

function NewWordForm({ onNewWordSubmit }) {
  const [newWord, setNewWord] = useState("");
  const [newDefinition, setNewDefinition] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
  
    try {
      // Make a POST request to the Flask API endpoint
      const response = await fetch('http://127.0.0.1:5000/AddWordForm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ word: newWord, definition: newDefinition }),
      });
  
      if (!response.ok) {
        // Extract error message from response
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }
  
      // Clear input fields and reset error
      setNewWord("");
      setNewDefinition("");
      setError(null);
    } catch (error) {
      // Log the actual error message received from the server
      console.error('Failed to add word:', error);
      setError('Failed to add word: ' + error.message); // Update error message to include the actual error
    }
  };
  
  

  return (
    <form onSubmit={handleSubmit} className="add-word-form">
      <div>
        <p className="word-text">Word</p>
        <input
          type="text"
          value={newWord}
          onChange={(e) => setNewWord(e.target.value)}
          required
          className="word-input"
          placeholder="Enter a word"
        />
      </div>
      <div>
        <p className="definition-text">Definition</p>
        <input
          type="text"
          value={newDefinition}
          onChange={(e) => setNewDefinition(e.target.value)}
          required
          className="definition-input"
          placeholder="Enter a definition"
        />
      </div>
      {error && <p className="error-message">{error}</p>}
      <button type="submit">Add Word</button>
    </form>
  );
}

export default NewWordForm;
