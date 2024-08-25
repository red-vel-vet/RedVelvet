import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import Button from '../components/Button'; // Import the Button component
import '../styles/EventsManagement.css'; // Create a CSS file for this component

function EventsManagement() {
    const [hosts, setHosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchHosts();
    }, []);

    const fetchHosts = () => {
        api.get('/api/user-hosts/')
            .then((res) => setHosts(res.data))
            .catch((err) => {
                if (err.response.status === 401) {
                    navigate('/login');
                } else {
                    alert('Failed to fetch hosts');
                }
            });
    };

    const handleCreateHost = () => {
        navigate('/events-management/create-host');
    };

    return (
        <div className="events-management-container">
            <h2>Your Hosts</h2>
            <ul className="hosts-list">
                {hosts.map((host) => (
                    <li key={host.id}>
                        <Link to={`/events-management/hosts/${host.id}`} className="host-link">
                            {host.name}
                        </Link>
                    </li>
                ))}
            </ul>
            <Button className="button submit" onClick={handleCreateHost}>
                Create New Host
            </Button>
        </div>
    );
}

export default EventsManagement;