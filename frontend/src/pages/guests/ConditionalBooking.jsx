import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import '../../styles/ConditionalBooking.css'; 

function ConditionalBooking() {
  const location = useLocation();
  const navigate = useNavigate();

  // Access the events passed via navigation state
  const { selectedEvents = [] } = location.state || {};

  // Placeholder function for handling conditions (this can be expanded later)
  const handleConfirmBooking = () => {
    alert("Booking process will be implemented here based on conditions.");
  };

  return (
    <>
      <div className='booking-content'>
        <h1>Conditional Booking</h1>
        {selectedEvents.length > 0 ? (
          <div>
            <h4>Selected Events</h4>
            <ul className="event-bookings">
              {selectedEvents.map((event, index) => ( 
                <li key={index} className="event-booking">
                  <div className="event-flex-container">
                    <img src={event.image_url} alt={event.title} className="cb-event-image" />
                    <div className="cb-details">
                      <p><strong>{event.title}</strong></p>
                      <p><strong>Host:</strong> {event.host}</p>
                      <p><strong>Date:</strong> {new Date(event.start).toLocaleDateString()}</p>
                    </div>
                  </div>
                </li> 
              ))}
            </ul>
            <div id="match-minimum">
              <h4>Match Minimum: </h4>
              <select>
                {[...Array(10).keys()].map(i => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <p>No events selected. Please go back and select events.</p>
        )}
      </div>
      <div className="button-container">
        <Button
          className="button cancel"
          onClick={() => navigate('/guests/events')}
        >
          Go Back
        </Button>
        <Button
          className="button submit"
          onClick={handleConfirmBooking}
          disabled={selectedEvents.length === 0} // Disable button if no events are selected
        >
          Buy
        </Button>
      </div>
    </>
  );
}

export default ConditionalBooking;