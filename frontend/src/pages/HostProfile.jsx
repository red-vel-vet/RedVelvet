import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import Button from '../components/Button';
import '../styles/HostProfile.css';  
import HostEditModal from '../components/HostEditModal'; 

function HostProfile() {
    const { id } = useParams(); 
    const [host, setHost] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        fetchHostDetails();
    }, []);

    const fetchHostDetails = () => {
        api.get(`/api/hosts/${id}/`)
            .then((res) => setHost(res.data))
            .catch((err) => console.error('Failed to fetch host details:', err));
    };

    const handleSave = (updatedData) => {   
        api.put(`/api/hosts/update/${id}/`, updatedData) 
            .then((response) => {
                console.log('Response from the backend:', response); 
                setIsEditModalOpen(false);
                fetchHostDetails(); 
            })
            .catch((err) => {
                console.error('Failed to update host details:', err);
            });
    };

    if (!host) {
        return <div>Loading...</div>;
    }

    return (
        <div className="host-profile-container">
            {host.logo_url ? (
                <a href={host.website_url} target="_blank" rel="noopener noreferrer">
                    <img src={host.logo_url} alt={host.name} className="host-logo" />
                </a>
            ) : (
                <h1 className="host-name">{host.name}</h1>
            )}
            <h2 className="host-tagline">{host.tagline}</h2>
            {/* <p className="host-email">
                <strong>Email: </strong>
                <a href={`mailto:${host.email}`}>{host.email}</a>
            </p> */}
            <p className="host-description">{host.description}</p>
            <div className="button-container">
                <Button className="button submit" onClick={() => setIsEditModalOpen(true)}>
                    Edit
                </Button>
            </div>

            {isEditModalOpen && (
                <HostEditModal
                    host={host}
                    onSave={handleSave}
                    onClose={() => setIsEditModalOpen(false)}
                />
            )}
        </div>
    );
}

export default HostProfile;