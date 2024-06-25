import React from 'react';
import '../styles/EventDetails.css';
import logo from '../assets/images/token.png';

function EventDetails({ selectedEvent, eventModalVisible, onCancel }) {
    if (!eventModalVisible) return null;

    const eventDate = new Date(selectedEvent.start);
    const eventEndDate = new Date(selectedEvent.end);
    const month = eventDate.toLocaleString('default', { month: 'short' });
    const day = eventDate.getDate();
    const dayName = eventDate.toLocaleString('default', { weekday: 'short' });
    const startTime = eventDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const endTime = eventEndDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

    const defaultImage = 'https://images.unsplash.com/photo-1571118027171-d2e2c56cc926?q=80&w=2371&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

    return (
        <div className="modal-background">
            <div className="modal-content">
                <img src={logo} alt="Red Velvet Icon" className="event-icon" />
                <div className="container">
                    <h2 className="host">{selectedEvent.host.toUpperCase()}</h2>
                    <p className="event-name">{selectedEvent.title}</p>
                    <img src={selectedEvent.image_url || defaultImage} alt="Event" className="event-image" />
                    <p className="details-text">{month} {day} {startTime} - {endTime}</p>
                    <p className="details-text">{selectedEvent.city}, {selectedEvent.state}</p>
                    <div className="scroll-view-container">
                        <div className="scroll-view">
                            <p className="text">
                                {selectedEvent.description}
                                {selectedEvent.membershipRequired ? 'Membership Required.' : ''}
                            </p>
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