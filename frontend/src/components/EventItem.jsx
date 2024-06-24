import React from 'react';
import '../styles/EventItem.css'; // Component-specific styles

const EventItem = ({ event, onClick }) => {
    const eventDate = new Date(event.start);
    const month = eventDate.toLocaleString('default', { month: 'short' });
    const day = eventDate.getDate();
    const dayName = eventDate.toLocaleString('default', { weekday: 'short' });
    const startTime = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const defaultImage = 'https://images.unsplash.com/photo-1571118027171-d2e2c56cc926?q=80&w=2371&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

    return (
        <li className="event-item" onClick={onClick}>
            <div className="event-date-container">
                <p className="event-month">{month.toUpperCase()}</p>
                <p className="event-day">{day}</p>
            </div>
            <div className="event-details">
                <p className="event-name">{event.title}</p>
                <p className="event-host">{event.host.toUpperCase()}</p>
                <p className="event-location">{event.city}, {event.state}</p>
                <p className="event-time">{dayName} • {startTime}</p>
            </div>
            <div className="event-logo-container">
                <img src={event.image_url || defaultImage} alt="Event logo" className="event-logo" />
            </div>
        </li>
    );
};

export default EventItem;
