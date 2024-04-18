import React, { useState, useEffect } from 'react';
import '../../../styles/AddWordPage.css'; // Adjust the number of `../` parts as needed
import { v4 as uuidv4 } from 'uuid';

function WordList({ selectedDate }) {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch words data from Flask app based on the selected date
    fetchWords(selectedDate);
  }, [selectedDate]); // Include selectedDate in the dependency array

  // Function to fetch words from the backend and format them with unique IDs
const fetchWords = async (selectedDate) => {
  try {
    // Fetch words data from Flask app based on the selected date
    const response = await fetch('http://127.0.0.1:5000/test_get_words', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ selectedDate })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();
    // Add unique IDs to each word object
    const wordsWithIds = data.map(word => ({ ...word, id: uuidv4() }));
    setWords(wordsWithIds);
    setLoading(false);
  } catch (error) {
    console.error('Error fetching words:', error);
    setLoading(false);
  }
};


  
  const handleCheckboxChange = (wordId) => {
    setWords(prevWords => 
      prevWords.map(word => {
        if (word.id === wordId) {
          return { ...word, isChecked: !word.isChecked };
        }
        return word;
      })
    );
  }; 
  

  // Filter out checked words
  const filteredWords = words.filter(word => !word.isChecked);
  

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <section className="word-list-container">
          <ul className="word-list">
            {filteredWords.map(word => (
              <li key={word.id}>
                <div className="word-details">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={word.isChecked || false}
                      onChange={() => handleCheckboxChange(word.id)}
                      className="checkbox-input"
                    />
                    <span className="checkbox-image">
                      {word.isChecked && (
                        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/f84cb3f426e64e124f0ca029dc4a6a7239871781a17e7dd1f17275fddc722916?apiKey=f26453df6e5c43b6bfc2cda86201a2b9&" alt="Check Box" className="checkBox" />
                      )}
                    </span>
                  </label>
                  <h2 className="word">{word.word}</h2>
                  <p className="word-phonetic">{word.phonetic}</p>
                </div>
                <p className="word-definition">{word.definition}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export default WordList;
