import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

function ToAllDaysHeader() {
    const navigate = useNavigate(); // Use useNavigate hook to get navigation function

    const toCalendarGrid = () => {
        navigate('/calendar'); // Use navigate function to navigate to '/calendar'
    };

    return (
        <div className="alldays-container">
            <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/847b81fa3f65c0c7ea0a1383da4a49a3a121627fb037c890d3fe546ea83950d1?apiKey=f26453df6e5c43b6bfc2cda86201a2b9&"
                alt="Product Image"
                className="alldays-image"
                loading="lazy"
                onClick={toCalendarGrid}
            />
        </div>
    );
}

export default ToAllDaysHeader;
