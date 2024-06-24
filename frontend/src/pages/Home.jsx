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

    useEffect(() => {
        getEvents();
    }, []);

    const getEvents = () => {
        api.get('/api/events/')
            .then((res) => res.data)
            .then((data) => {
                const sortedData = data.sort((a, b) => new Date(a.start) - new Date(b.start));
                setEvents(sortedData);
            })
            .catch((err) => alert(err));
    };

    const handleEventClick = (event) => {
        api.get(`/api/events/${event.id}`)
            .then((res) => {
                setSelectedEvent(res.data);
                setEventModalVisible(true);
            })
            .catch((err) => alert(err));
    };

    return (
        <div className="home-container">
            <header className="header">
                <img src={logo} alt="Red Velvet Icon" className="logo" />
                <h1 className="title">RED VELVET</h1>
            </header>
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
            
            {eventModalVisible && selectedEvent && (
                <EventDetails
                    eventModalVisible={eventModalVisible}
                    selectedEvent={selectedEvent}
                    onCancel={() => setEventModalVisible(false)}
                />
            )}
        </div>
    );
}

export default Home;