import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/EventDetails.css';
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
    const getButtonLabel = () => {
        if (isButtonInactive) {
            return 'Application Pending';
        } else if (selectedEvent.membership_required) {
            return 'Apply';
        } else {
            return isAdded ? 'Remove' : 'Add';
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
            onToggleAddRemove();
        }
    };

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-content slide-up" onClick={(e) => e.stopPropagation()}>
                <div className="event-header">
                    <h1>{selectedEvent.host}</h1>
                    <h2 className="modal-event-name">{selectedEvent.title}</h2>
                </div>

                <div className="scroll-view-container">
                    <div className="scroll-view">
                        {selectedEvent.image_url ? (
                            <img src={selectedEvent.image_url} alt="Event" className="event-image" />
                        ) : null}
                        <div className="event-text">
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
                        </div>
                    </div>
                </div>

                <div className="button-container">
                    <Button className="button cancel" onClick={onCancel}>
                        Back
                    </Button>
                    <Button
                        className={`button submit ${isButtonInactive ? 'inactive' : ''}`}
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