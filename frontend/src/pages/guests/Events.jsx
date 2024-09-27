import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api'; 
import EventItem from '../../components/EventItem'; 
import DateFilterModal from '../../components/DateFilterModal';
import Button from '../../components/Button';
import EventDetails from '../../components/EventDetails';
import logo from '../../assets/images/token.png';
import '../../styles/Guests.css';
import '../../styles/Events.css';   


function Events() {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [eventModalVisible, setEventModalVisible] = useState(false);
    const [dateModalVisible, setDateModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [addedEvents, setAddedEvents] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false); 

    const navigate = useNavigate();

    // Check if the user is logged in
    useEffect(() => {
        const checkLoginStatus = () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
        };

        checkLoginStatus();
    }, []);

    useEffect(() => {
        getEvents();
    }, []);

    useEffect(() => {
        filterEvents();
    }, [events, searchQuery, startDate, endDate]);

    const getEvents = () => {
        setIsLoading(true); 
        api.get('/api/events/')
            .then((res) => res.data)
            .then((data) => {
                const sortedData = data.sort((a, b) => new Date(a.start) - new Date(b.start));
                setEvents(sortedData);
                setFilteredEvents(sortedData);
            })
            .catch((err) => alert(err))
            .finally(() => setIsLoading(false)); 
    };

    const filterEvents = () => {
        let filtered = events;
        
        if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            filtered = filtered.filter(event => 
                event.title?.toLowerCase().includes(lowerCaseQuery) ||
                (event.description && event.description?.toLowerCase().includes(lowerCaseQuery)) ||
                event.host?.toLowerCase().includes(lowerCaseQuery) ||
                event.city?.toLowerCase().includes(lowerCaseQuery) ||
                event.state?.toLowerCase().includes(lowerCaseQuery)
            );
        }

        if (startDate && endDate) {
            filtered = filtered.filter(event => 
                new Date(event.start) >= startDate && new Date(event.start) <= endDate
            );
        }

        setFilteredEvents(filtered);
    };

    const onToggleAddRemove = (eventId) => {
        setAddedEvents((prevAddedEvents) => {
            if (prevAddedEvents.includes(eventId)) {
                return prevAddedEvents.filter(id => id !== eventId);
            } else {
                return [...prevAddedEvents, eventId];
            }
        });
    };

    const handleEventClick = (event) => {
        const url = `/api/events/${event.id}/`;

        api.get(url)
            .then((res) => {
                setSelectedEvent(res.data);
                setEventModalVisible(true);
            })
            .catch((err) => alert(err));
    };

    const handleCreateTakeoverClick = () => {
        if (addedEvents.length === 0) {
            alert("Please add at least one event to create a takeover.");
            return;
        }
        
        // Find the selected event details using the addedEvents array (which contains the event IDs)
        const selectedEventDetails = events.filter(event => addedEvents.includes(event.id));
        
        // Navigate to the ConditionalBooking page and pass the selected events data
        navigate('/guests/conditionalbooking', {
            state: { selectedEvents: selectedEventDetails }
        });
    };

    const clearSearch = () => {
        setSearchQuery('');
    };

    return (
        <div>
            <div className="search-filter-container">
                <div className="search-bar-container">
                    <input 
                        type="text" 
                        id="searchBar"
                        placeholder="Search events..." 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                        className="search-bar"
                    />
                    {searchQuery && <button className="clear-button" onClick={clearSearch}>×</button>}
                </div>
                <Button 
                    className="button date-filter-button" 
                    type="button" 
                    onClick={() => setDateModalVisible(true)}
                >
                    Dates
                </Button>
            </div>
            <div>
                {isLoading ? (
                    <div className="home-container">
                        <div className="loading-container">
                            <img src={logo} alt="Red Velvet Icon" className="loading-logo" />
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="home-container">
                            <main className="events-container">
                                <ul className="event-list">
                                    {filteredEvents.map((event) => (
                                        <EventItem
                                            key={event.id}
                                            event={event}
                                            isAdded={addedEvents.includes(event.id)}
                                            onToggleAddRemove={() => onToggleAddRemove(event.id)}
                                            onClick={() => handleEventClick(event)}
                                        />
                                    ))}
                                </ul>
                            </main>
                        </div>
                    </>
                )}
            </div>
            <div className="takeover-footer">
                <Button
                    className="takeover-button button submit"
                    onClick={() => {
                        handleCreateTakeoverClick();
                    }}
                >
                    Create a Takeover!
                </Button> 
            </div>
            {eventModalVisible && selectedEvent && (
                <EventDetails
                    selectedEvent={selectedEvent}
                    isAdded={addedEvents.includes(selectedEvent.id)}
                    onToggleAddRemove={() => onToggleAddRemove(selectedEvent.id)}
                    onCancel={() => setEventModalVisible(false)}
                />
            )}
            {dateModalVisible && (
                <DateFilterModal 
                    startDate={startDate}
                    endDate={endDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                    dateModalVisible={dateModalVisible}
                    onCancel={() => setDateModalVisible(false)}
                    isLoggedIn={isLoggedIn}
                />
            )}
        </div>
    );
}

export default Events;