import React from 'react';
import eventItemStyles from '../styles/EventItem.module.css';  // Import EventItem.module.css for general structure
import addItem from '../assets/icons/add.svg';
import removeItem from '../assets/icons/remove.svg';

const EventItem = ({ event, isAdded, onToggleAddRemove, onClick, themeStyles }) => {
    const eventDate = new Date(event.start);
    const month = eventDate.toLocaleString('default', { month: 'short', timeZone: 'UTC' });
    const day = eventDate.getUTCDate();
    const dayName = eventDate.toLocaleString('default', { weekday: 'short', timeZone: 'UTC' });
    const startTime = eventDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' });

    return (
        <li 
            className={`${eventItemStyles.eventItem} ${isAdded ? eventItemStyles.selectedEvent : ''}`}  // Base structure from EventItem.module.css
            onClick={onClick}
        >
            {event.image_url && (
                <img 
                    src={event.image_url} 
                    alt="Event logo" 
                    className={eventItemStyles.eventLogo}  // Base structure
                />
            )}
            <div className={eventItemStyles.eventInfo}>
                <p className={eventItemStyles.eventTitle}>{event.title}</p>
                <p className={eventItemStyles.hostName}>{event.host}</p>
                <p className={eventItemStyles.eventDate}>{dayName}, {month} {day} - {startTime}</p>
                {/* {!event.membership_required && (
                    <img 
                        src={isAdded ? removeItem : addItem} 
                        alt="Add/Remove Item" 
                        className={`${themeStyles.addRemoveIcon} ${eventItemStyles.addRemoveIcon}`}  // Use color from Guests/Hosts module, base style from EventItem.module.css
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleAddRemove();  
                        }}
                    />
                )} */}
            </div>
        </li>
    );
};

export default EventItem;