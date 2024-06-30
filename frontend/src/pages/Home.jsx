import React, { useState, useEffect } from 'react';
import '../styles/styles.css'; 
import '../styles/Home.css';   
import logo from '../assets/images/token.png';
import api from '../api'; 
import EventItem from '../components/EventItem'; 
import EventDetails from '../components/EventDetails'; // Assuming this is the modal component

function Home() {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [eventModalVisible, setEventModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Added isLoading state

    useEffect(() => {
        getEvents();
    }, []);

    const getEvents = () => {
        setIsLoading(true); // Start loading
        api.get('/api/events/')
            .then((res) => res.data)
            .then((data) => {
                const sortedData = data.sort((a, b) => new Date(a.start) - new Date(b.start));
                setEvents(sortedData);
            })
            .catch((err) => alert(err))
            .finally(() => setIsLoading(false)); // Stop loading regardless of result
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
                                    {events.map((event) => (
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
        </>
    );
}

export default Home;