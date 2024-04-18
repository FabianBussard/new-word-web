// AddWordPage.jsx
// Component that regroups sub-components
import React from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation hook from react-router-dom
import DayDateHeader from './components/DayDateHeader';
import WordList from './components/DisplayWords';
import TriggerNewWordForm from './components/TriggerNewWordForm';
import NewWordForm from './components/NewWordForm';
import ToAllDaysHeader from './components/ToAllDaysHeader';
import '../../styles/AddWordPage.css';



function AddWordPage() {
  // Define any props or state if needed
  // Use useLocation hook to access location object
  const location = useLocation();
  // Extract selectedDate from URL query parameters
  const searchParams = new URLSearchParams(location.search);
  const selectedDate = searchParams.get('selectedDate');

  return (
    <main className="word-of-the-day">
      <ToAllDaysHeader />
      <DayDateHeader selectedDate={selectedDate} /> {/* Pass selectedDate to DayDateHeader component */}
      <WordList selectedDate={selectedDate} /> {/* Pass selectedDate to WordList component */}
      <TriggerNewWordForm />
    </main>
  );
}

export default AddWordPage;
