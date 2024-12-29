import React from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import EDstyles from '../styles/EventDetails.module.css';
import Button from './Button';

function EventDetails({
  selectedEvent,
  isAdded,
  onToggleAddRemove,
  onCancel,
  isLoggedIn
}) {
  const navigate = useNavigate();

  // Example date/time calculations
  const eventDate = new Date(selectedEvent.start);
  const eventEndDate = new Date(selectedEvent.end);
  const month = eventDate.toLocaleString('default', { month: 'short', timeZone: 'UTC' });
  const day = eventDate.getUTCDate();
  const dayName = eventDate.toLocaleString('default', { weekday: 'short', timeZone: 'UTC' });
  const startTime = eventDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' });
  const endTime = eventEndDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' });

  const isButtonInactive = selectedEvent.membership_status === 'Applied';

  const getButtonLabel = () => {
    if (isButtonInactive) {
      return 'Application Pending';
    } else if (selectedEvent.membership_required) {
      return 'Apply';
    } else {
      // Both states show 'Buy' in your example
      return isAdded ? 'Buy' : 'Buy';
    }
  };

  const handleButtonClick = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    if (isButtonInactive) return;
    if (selectedEvent.membership_required) {
      alert('You need to apply for membership to attend this event.');
    } else {
      navigate('/guests/conditionalbooking', {
        state: { selectedEvents: [selectedEvent] }
      });
    }
  };

  return (
    <Modal isOpen={true} onClose={onCancel}>
      {/* 
        We define three main sections:
        1) modalHeader   -> pinned top
        2) modalScrollArea -> scrollable middle
        3) modalFooter   -> pinned bottom
      */}
      <div className={EDstyles.modalHeader}>
        <h2>{selectedEvent.host}</h2>
        <h3>{selectedEvent.title}</h3>
      </div>

      <div className={EDstyles.modalScrollArea}>
        {selectedEvent.image_url && (
          <img
            src={selectedEvent.image_url}
            alt="Event"
            className={EDstyles.eventImage}
          />
        )}
        <div className={EDstyles.eventText}>
          <h4>Description</h4>
          <p>
            {selectedEvent.description.trim().split('\n').map((line, idx) => (
              <React.Fragment key={idx}>
                {line}
                <br /><br />
              </React.Fragment>
            ))}
          </p>
          <h4>Details</h4>
          <p>
            Location: {selectedEvent.city}, {selectedEvent.state}
            <br />
            Date: {dayName}, {month} {day}
            <br />
            Time: {startTime} - {endTime}
            <br /><br />
          </p>
          <h4>Matches Attending: {selectedEvent.matches_attending_count || 3}</h4>
        </div>
      </div>

      <div className={EDstyles.modalFooter}>
        <Button variant="cancel" onClick={onCancel}>
          Back
        </Button>
        <Button variant="submit" onClick={handleButtonClick} disabled={isButtonInactive}>
          {getButtonLabel()}
        </Button>
      </div>
    </Modal>
  );
}

export default EventDetails;