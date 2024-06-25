import React from 'react';
import '../styles/EventDetails.css';
import logo from '../assets/images/token.png';
import api from '../api'; 

function EventDetails({ selectedEvent, eventModalVisible, onCancel }) {
    if (!eventModalVisible) return null;

    const eventDate = new Date(selectedEvent.start);
    const eventEndDate = new Date(selectedEvent.end);
    const month = eventDate.toLocaleString('default', { month: 'short', timeZone: 'UTC' });
    const day = eventDate.getUTCDate();
    const dayName = eventDate.toLocaleString('default', { weekday: 'short', timeZone: 'UTC' });
    const startTime = eventDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' });
    const endTime = eventEndDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' });

    return (
        <div className="modal-background">
            <div className="modal-content">
                <div className="container">
                    <div className="modal-header">


                        {/* <img src={selectedEvent.host_logo_url ? selectedEvent.host_logo_url:logo} alt="Red Velvet Icon" className="event-icon" /> */}
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
                            { selectedEvent.image_url ? <img src={selectedEvent.image_url} alt="Event" className="event-image" /> : null }
                            <div className="text">
                                {selectedEvent.description.trim().split('\n').map((line, index) => (
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