import React from 'react';
import '../styles/EventDetails.css';
import logo from '../assets/images/token.png';

function EventDetails({ selectedEvent, eventModalVisible, onCancel }) {
    if (!eventModalVisible) return null;

    const eventDate = new Date(selectedEvent.start);
    const eventEndDate = new Date(selectedEvent.end);
    const month = eventDate.toLocaleString('default', { month: 'short', timeZone: 'UTC' });
    const day = eventDate.getUTCDate();
    const dayName = eventDate.toLocaleString('default', { weekday: 'short', timeZone: 'UTC' });
    const startTime = eventDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' });
    const endTime = eventEndDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' });

    const defaultImage = 'https://images.unsplash.com/photo-1571118027171-d2e2c56cc926?q=80&w=2371&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

    return (
        <div className="modal-background">
            <div className="modal-content">
                <div className="container">
                    <div className="modal-header">
                        <img src={logo} alt="Red Velvet Icon" className="event-icon" />
                        <div className="event-header">
                            <p className="modal-host">{selectedEvent.host.toUpperCase()}</p>
                            <p className="modal-event-name">{selectedEvent.title.toUpperCase()}</p>
                            <p className="details-text">{dayName}, {month} {day} • {startTime} - {endTime}</p>
                            <p className="details-text">{selectedEvent.city}, {selectedEvent.state}</p>
                        </div>
                    </div>
                    
                    <div className="scroll-view-container">
                        <div className="scroll-view">
                            <img src={selectedEvent.image_url || defaultImage} alt="Event" className="event-image" />
                            <div className="text">
                                {selectedEvent.description.split('\n').map((line, index) => (
                                    <React.Fragment key={index}>
                                    {line}
                                    <br/><br/>
                                    </React.Fragment>
                                ))}
                                {selectedEvent.membershipRequired ? 'Membership Required.' : ''}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="button-container">
                    <button className="cancel-button" onClick={onCancel}>Back</button>
                    <button className="submit-button" onClick={() => {
                        if (selectedEvent.event_url) {
                            window.open(selectedEvent.event_url, '_blank');
                        } else {
                            alert('Please contact the host for details on how to attend this event.');
                        }
                    }}>RSVP</button>
                </div>
            </div>
        </div>
    );
}

export default EventDetails;