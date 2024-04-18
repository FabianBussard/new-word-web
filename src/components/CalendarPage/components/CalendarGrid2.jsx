import * as React from 'react';
import dayjs from 'dayjs';
import Badge from '@mui/material/Badge';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import { Link } from 'react-router-dom';

const fetchWordDatesFromDatabase = async () => {
  try {
    // Fetch word dates from the database
    const response = await fetch('http://127.0.0.1:5000/word-dates');
    if (!response.ok) {
      throw new Error('Failed to fetch word dates');
    }
    const data = await response.json();
    return data.wordDates; 
  } catch (error) {
    console.error('Error fetching word dates:', error);
    return []; // Return an empty array if there's an error
  }
};

function ServerDay(props) {
  const { day, outsideCurrentMonth, ...other } = props;
  const [isHighlighted, setIsHighlighted] = React.useState(false);

  React.useEffect(() => {
    const fetchHighlightedDays = async () => {
      try {
        const wordDates = await fetchWordDatesFromDatabase();
        const dateObj = dayjs(day);
        const isHighlightedDay = wordDates.some((wordDate) => {
          const wordDateObj = dayjs(wordDate);
          return (
            wordDateObj.date() === dateObj.date() &&
            wordDateObj.month() === dateObj.month() &&
            wordDateObj.year() === dateObj.year()
          );
        });
        setIsHighlighted(isHighlightedDay);
      } catch (error) {
        console.error('Error fetching word dates:', error);
      }
    };

    fetchHighlightedDays();
  }, [day]);

  return (
    <Badge
      key={day.toString()}
      overlap="circular"
      badgeContent={isHighlighted ? '🌚' : undefined}
    >
      <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
    </Badge>
  );
}


export default function DateCalendarServerRequest() {
  const requestAbortController = React.useRef(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [highlightedDays, setHighlightedDays] = React.useState([1, 2, 15]);
  const [selectedDate, setSelectedDate] = React.useState(dayjs());

  // Fetch highlighted days
  const fetchHighlightedDays = (date) => {
    const controller = new AbortController();
    fetchWordDatesFromDatabase()
      .then((wordDates) => {
        // Process word dates to extract the days of the current month
        const daysToHighlight = wordDates
          .map((wordDate) => dayjs(wordDate))
          .filter((wordDate) => {
            return (
              wordDate.date() === date.date() &&
              wordDate.month() === date.month() && 
              wordDate.year() == date.year()
            );
          })
          .map((wordDate) => wordDate.date());
        setHighlightedDays(daysToHighlight);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error('Error fetching word dates:', error);
      });
  
    requestAbortController.current = controller;
  };

  React.useEffect(() => {
    fetchHighlightedDays(selectedDate);
    return () => requestAbortController.current?.abort();
  }, [selectedDate]);

  const handleMonthChange = (date) => {
    if (requestAbortController.current) {
      requestAbortController.current.abort();
    }

    setIsLoading(true);
    setHighlightedDays([]);
    fetchHighlightedDays(date);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        value={selectedDate}
        loading={isLoading}
        onMonthChange={handleMonthChange}
        renderLoading={() => <DayCalendarSkeleton />}
        onChange={handleDateSelect}
        slots={{
          day: ServerDay,
        }}
        slotProps={{
          day: {
            highlightedDays,
          },
        }}
      />
      <Link to={`/AddWordPage?selectedDate=${selectedDate.format('YYYY-MM-DD')}`}>See Words for Selected Date</Link>
    </LocalizationProvider>
  );
}
