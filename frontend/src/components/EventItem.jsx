// import React, { useState } from 'react';
import '../styles/EventItem.css'; 
import addItem from '../assets/icons/add.svg';
import removeItem from '../assets/icons/remove.svg';

const EventItem = ({ event, isAdded, onToggleAddRemove, onClick }) => {
    const eventDate = new Date(event.start);
    const month = eventDate.toLocaleString('default', { month: 'short', timeZone: 'UTC' });
    const day = eventDate.getUTCDate();
    const dayName = eventDate.toLocaleString('default', { weekday: 'short', timeZone: 'UTC' });
    const startTime = eventDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' });

    return (
        <li 
            className={`event-item ${isAdded ? 'selected-event' : ''}`}  // Add selected class
            onClick={onClick}
        >
            {event.image_url && (
                <img 
                    src={event.image_url} 
                    alt="Event logo" 
                    className="event-logo" 
                />
            )}
            <div className='event-info'>
                <p className='event-title'>{event.title}</p>
                <p className='host-name'>{event.host}</p>
                <p className="event-date">{dayName}, {month} {day} - {startTime}</p>
                {!event.membership_required && (
                    <img 
                        src={isAdded ? removeItem : addItem} 
                        alt="Add/Remove Item" 
                        className="add-remove-icon" 
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleAddRemove();  
                        }}
                    />
                )}
            </div>
        </li>
    );
};

export default EventItem;