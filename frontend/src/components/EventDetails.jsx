// frontend/src/components/EventDetails.jsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EDstyles from '../styles/EventDetails.module.css'; // Import the CSS module
import Button from './Button';

function EventDetails({ selectedEvent, isAdded, onToggleAddRemove, onCancel, isLoggedIn }) {
    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.overflow = 'hidden'; // Disable scrolling when modal is open
        return () => {
            document.body.style.overflow = 'auto'; // Re-enable scrolling when modal is closed
        };
    }, []);

    const eventDate = new Date(selectedEvent.start);
    const eventEndDate = new Date(selectedEvent.end);
    const month = eventDate.toLocaleString('default', { month: 'short', timeZone: 'UTC' });
    const day = eventDate.getUTCDate();
    const dayName = eventDate.toLocaleString('default', { weekday: 'short', timeZone: 'UTC' });
    const startTime = eventDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' });
    const endTime = eventEndDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' });

    const isButtonInactive = selectedEvent.membership_status === 'Applied';
    
    // Updated button label logic
    const getButtonLabel = () => {
        if (isButtonInactive) {
            return 'Application Pending';
        } else if (selectedEvent.membership_required) {
            return 'Apply';
        } else {
            return isAdded ? 'Buy' : 'Buy'; // Both states show "Buy"
        }
    };

    const handleButtonClick = () => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }
        if (isButtonInactive) return;
        if (selectedEvent.membership_required) {
            alert("You need to apply for membership to attend this event.");
        } else {
            // Navigate to the booking page with the selected event's details
            navigate('/guests/conditionalbooking', {
                state: { selectedEvents: [selectedEvent] } // Pass the selected event as an array
            });
        }
    };

    return (
        <div className={EDstyles.modalOverlay} onClick={onCancel}>
            <div className={`${EDstyles.modalContent} ${EDstyles.slideUp}`} onClick={(e) => e.stopPropagation()}>
                <div className={EDstyles.eventHeader}>
                    <h1>{selectedEvent.host}</h1>
                    <h2 className={EDstyles.modalEventName}>{selectedEvent.title}</h2>
                </div>

                <div className={EDstyles.scrollViewContainer}>
                    <div className={EDstyles.scrollView}>
                        {selectedEvent.image_url ? (
                            <img src={selectedEvent.image_url} alt="Event" className={EDstyles.eventImage} />
                        ) : null}
                        <div className={EDstyles.eventText}>
                            <h3>Description</h3>
                            <p>
                                {selectedEvent.description.trim().split('\n').map((line, index) => (
                                    <React.Fragment key={index}>
                                        {line}
                                        <br />
                                        <br />
                                    </React.Fragment>
                                ))}
                            </p>
                            <h3>Details</h3>
                            <p>
                                Location: {selectedEvent.city}, {selectedEvent.state}
                                <br />
                                Date: {dayName}, {month} {day}
                                <br />
                                Time: {startTime} - {endTime}
                                <br />
                                <br />
                            </p>
                            <h3>Matches Attending: {selectedEvent.matches_attending_count || 3}</h3> {/* Default value of 3 */}
                        </div>
                    </div>
                </div>

                <div className={EDstyles.buttonContainer}>
                    <Button 
                        variant='cancel' 
                        onClick={onCancel}
                    >
                        Back
                    </Button>
                    <Button
                        variant='submit'
                        onClick={handleButtonClick}
                        disabled={isButtonInactive}
                    >
                        {getButtonLabel()}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default EventDetails;