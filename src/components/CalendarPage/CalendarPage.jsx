// CalendarPage.jsx

import React from 'react';
import AllDaysHeader from './components/AllDaysHeader';
import DatePickerComponent2 from './components/CalendarGrid2';
import '../../styles/CalendarPage.css';




function CalendarPage(){

    return(
        <main className = "calendar-grid">
            <AllDaysHeader></AllDaysHeader>
            <DatePickerComponent2></DatePickerComponent2>
        </main>
    )
}

export default CalendarPage;