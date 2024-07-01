import React, { useState, useEffect } from 'react';
import '../styles/styles.css'; 
import '../styles/Home.css';   
import logo from '../assets/images/token.png';
import api from '../api'; 
import EventItem from '../components/EventItem'; 
import EventDetails from '../components/EventDetails'; 
import DateFilterModal from '../components/DateFilterModal';
import Button from '../components/Button';

function Home() {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [eventModalVisible, setEventModalVisible] = useState(false);
    const [dateModalVisible, setDateModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
        getEvents();
    }, []);

    useEffect(() => {
        filterEvents();
    }, [events, searchQuery, startDate, endDate]);

    const getEvents = () => {
        setIsLoading(true); // Start loading
        api.get('/api/events/')
            .then((res) => res.data)
            .then((data) => {
                const sortedData = data.sort((a, b) => new Date(a.start) - new Date(b.start));
                setEvents(sortedData);
                setFilteredEvents(sortedData);
            })
            .catch((err) => alert(err))
            .finally(() => setIsLoading(false)); // Stop loading regardless of result
    };

    const filterEvents = () => {
        let filtered = events;
        
        if (searchQuery) {
            filtered = filtered.filter(event => 
                event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        if (startDate && endDate) {
            filtered = filtered.filter(event => 
                new Date(event.start) >= startDate && new Date(event.start) <= endDate
            );
        }

        setFilteredEvents(filtered);
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

    return (
        <>
            <div className="search-filter-container">
                <input 
                    type="text" 
                    placeholder="Search events..." 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    className="search-bar"
                />
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
                                            onClick={() => handleEventClick(event)} 
                                        />
                                    ))}
                                </ul>
                            </main>
                        </div>
                    </>
                )}
            </div>
            {eventModalVisible && selectedEvent && (
                <EventDetails 
                    eventModalVisible={eventModalVisible}
                    selectedEvent={selectedEvent}
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
                />
            )}
        </>
    );
}

export default Home;