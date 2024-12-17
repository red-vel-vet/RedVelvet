import React from 'react';
import eventItemStyles from '../styles/EventItem.module.css';  

const EventItem = ({ event, isAdded, onToggleAddRemove, onClick }) => {  
    const eventDate = new Date(event.start);
    const month = eventDate.toLocaleString('default', { month: 'short', timeZone: 'UTC' });
    const day = eventDate.getUTCDate();
    const dayName = eventDate.toLocaleString('default', { weekday: 'short', timeZone: 'UTC' });
    const startTime = eventDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' });

    return (
        <li 
            className={`${eventItemStyles.eventItem} ${isAdded ? eventItemStyles.selectedEvent : ''}`}  
            onClick={onClick}
        >
            {event.image_url && (
                <img 
                    src={event.image_url} 
                    alt="Event logo" 
                    className={eventItemStyles.eventLogo}
                />
            )}
            <div className={eventItemStyles.eventInfo}>
                <p className={eventItemStyles.eventTitle}>{event.title}</p>
                <p className={eventItemStyles.hostName}>{event.host}</p>
                <p className={eventItemStyles.eventDate}>{dayName}, {month} {day} - {startTime}</p>
            </div>
        </li>
    );
};

export default EventItem;