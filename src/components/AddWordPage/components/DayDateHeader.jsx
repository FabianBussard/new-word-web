import React, { useState, useEffect } from 'react';
import '../../../styles/AddWordPage.css'; // Adjust the number of `../` parts as needed
import { useLocation } from 'react-router-dom'; // Import useLocation hook

function DayDateHeader() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const selectedDateParam = searchParams.get('selectedDate');
  let selectedDate = selectedDateParam ? new Date(selectedDateParam) : new Date();
  selectedDate.setDate(selectedDate.getDate() + 1);
  const [currentDate, setCurrentDate] = useState(selectedDate);

  useEffect(() => {
    // Update current date when selectedDate prop changes
    setCurrentDate(selectedDate);
  }, [selectedDate]);

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDayOfWeek = daysOfWeek[currentDate.getDay()];
  const formattedDate = currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className='currentDayDate-container'>
      <h3 className='currentDay'>{currentDayOfWeek}</h3>
      <p className='currentDate'>{formattedDate}</p>
    </div>
  );
}

export default DayDateHeader;
