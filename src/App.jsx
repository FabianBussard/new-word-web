import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddWordPage from './components/AddWordPage/AddWordPage';
import CalendarPage from './components/CalendarPage/CalendarPage';
import AllDaysHeader from './components/AddWordPage/components/ToAllDaysHeader'; // Import AllDaysHeader


function App() {
  return (
    <Router>
      {/* <AllDaysHeader />  Include AllDaysHeader component */}
      <Routes>
       <Route path="/AddWordPage" element={<AddWordPage />} />
       <Route path="/calendar" element={<CalendarPage />} /> 
      </Routes>
    </Router>
  );
}

export default App;
