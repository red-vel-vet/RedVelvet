import React from 'react';
import '../styles/EventDetails.css';
import Button from './Button';

function EventDetails({ selectedEvent, isAdded, onToggleAddRemove, onCancel }) {
    if (!selectedEvent) return null;

    const eventDate = new Date(selectedEvent.start);
    const eventEndDate = new Date(selectedEvent.end);
    const month = eventDate.toLocaleString('default', { month: 'short', timeZone: 'UTC' });
    const day = eventDate.getUTCDate();
    const dayName = eventDate.toLocaleString('default', { weekday: 'short', timeZone: 'UTC' });
    const startTime = eventDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' });
    const endTime = eventEndDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' });

    const getButtonLabel = () => {
        if (selectedEvent.membership_required) {
            return 'Apply';
        }
        return isAdded ? 'Remove' : 'Add';
    };

    const handleButtonClick = () => {
        if (selectedEvent.membership_required) {
            alert("You need to apply for membership to attend this event.");
        } else {
            onToggleAddRemove();
        }
    };

    return (
        <div className="modal-background">
            <div className="event-modal-content">
                <div className="event-header">
                    <p className="modal-host">{selectedEvent.host}</p>
                    <p className="modal-event-name">{selectedEvent.title}</p>
                </div>
                
                <div className="scroll-view-container">
                    <div className="scroll-view">
                        { selectedEvent.image_url ? <img src={selectedEvent.image_url} alt="Event" className="event-image" /> : null }
                        <div className="event-text">
                            <p className="section-title">Description</p>
                            <p className="section-content">
                                {selectedEvent.description.trim().split('\n').map((line, index) => (
                                    <React.Fragment key={index}>
                                    {line}
                                    <br/><br/>
                                    </React.Fragment>
                                ))}
                            </p>
                            <p className="section-title">Details</p>
                            <p className="section-content">
                                Location: {selectedEvent.city}, {selectedEvent.state}<br/>
                                Date: {dayName}, {month} {day}<br/>
                                Time: {startTime} - {endTime}<br/><br/>
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="button-container">
                    <Button className="button cancel" onClick={onCancel}>Back</Button>
                    <Button className="button submit" onClick={handleButtonClick}>
                        {getButtonLabel()}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default EventDetails;