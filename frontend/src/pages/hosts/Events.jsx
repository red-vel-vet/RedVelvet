// Events.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import EventItem from '../../components/EventItem';
import DateFilterModal from '../../components/DateFilterModal';
import Button from '../../components/Button';
import EventDetails from '../../components/EventDetails';
import logo from '../../assets/images/token.png';
import eventStyles from '../../styles/Events.module.css';

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

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
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
      .then(res => res.data)
      .then(data => {
        const sortedData = data.sort((a, b) => new Date(a.start) - new Date(b.start));
        setEvents(sortedData);
        setFilteredEvents(sortedData);
      })
      .catch(err => alert(err))
      .finally(() => setIsLoading(false));
  };

  const filterEvents = () => {
    let filtered = [...events];

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(event =>
        event.title?.toLowerCase().includes(lowerCaseQuery) ||
        event.description?.toLowerCase().includes(lowerCaseQuery) ||
        event.host?.toLowerCase().includes(lowerCaseQuery) ||
        event.city?.toLowerCase().includes(lowerCaseQuery) ||
        event.state?.toLowerCase().includes(lowerCaseQuery)
      );
    }

    if (startDate && endDate) {
      filtered = filtered.filter(
        event => new Date(event.start) >= startDate && new Date(event.start) <= endDate
      );
    }

    setFilteredEvents(filtered);
  };

  const onToggleAddRemove = eventId => {
    setAddedEvents(prev => {
      if (prev.includes(eventId)) {
        return prev.filter(id => id !== eventId);
      } else {
        return [...prev, eventId];
      }
    });
  };

  const handleEventClick = event => {
    api.get(`/api/events/${event.id}/`)
      .then(res => {
        setSelectedEvent(res.data);
        setEventModalVisible(true);
      })
      .catch(err => alert(err));
  };

  const handleCreateTakeoverClick = () => {
    if (addedEvents.length === 0) {
      alert('Please add at least one event to create a takeover.');
      return;
    }

    const selectedEventDetails = events.filter(e => addedEvents.includes(e.id));
    navigate('/guests/conditionalbooking', { state: { selectedEvents: selectedEventDetails } });
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className={eventStyles.eventsPage}>
      {/* FIXED SEARCH BAR BELOW HEADER */}
      <div className={eventStyles.searchFilterContainer}>
        <div className={eventStyles.searchBarContainer}>
          <input
            type="text"
            id="searchBar"
            placeholder="Search events..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={eventStyles.searchBar}
          />
          {searchQuery && (
            <button className={eventStyles.clearButton} onClick={clearSearch}>
              ×
            </button>
          )}
        </div>
        <Button variant="submit" type="button" onClick={() => setDateModalVisible(true)}>
          Dates
        </Button>
      </div>

      {/* SCROLL AREA FOR EVENTS */}
      <div className={eventStyles.eventsScrollArea}>
        {isLoading ? (
          <div className={eventStyles.loadingContainer}>
            <img src={logo} alt="Red Velvet Icon" className={eventStyles.loadingLogo} />
          </div>
        ) : (
          <ul className={eventStyles.eventList}>
            {filteredEvents.map(event => (
              <EventItem
                key={event.id}
                event={event}
                isAdded={addedEvents.includes(event.id)}
                onToggleAddRemove={() => onToggleAddRemove(event.id)}
                onClick={() => handleEventClick(event)}
              />
            ))}
          </ul>
        )}
      </div>

      {/* REPLACE WITH BUTTON IF YOU WANT TO CREATE TAKEOVER */}
      {/* <div className={eventStyles.takeoverFooter}>
        <Button variant="submit" onClick={handleCreateTakeoverClick}>
          Create a Takeover!
        </Button>
      </div> */}

      {/* MODALS */}
      {eventModalVisible && selectedEvent && (
        <EventDetails
          selectedEvent={selectedEvent}
          isAdded={addedEvents.includes(selectedEvent.id)}
          onToggleAddRemove={() => onToggleAddRemove(selectedEvent.id)}
          onCancel={() => setEventModalVisible(false)}
          isLoggedIn={isLoggedIn}
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