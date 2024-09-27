import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/VerifyEmail.css';

const VerifyEmail = () => {
    const [message, setMessage] = useState('Verifying email address...');
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');

        if (token) {
            api.post('/api/verify-email/', { token })
                .then(response => {
                    localStorage.setItem('access', response.data.access);
                    localStorage.setItem('refresh', response.data.refresh);
                    setMessage('Success! Redirecting...');
                    setLoading(false);
                    // Optionally redirect to login after a delay
                    setTimeout(() => {
                        navigate('/guests/events');
                    }, 3000);
                })
                .catch(error => {
                    console.log(error);
                    setMessage('Email verification failed. Please try again.');
                    setLoading(false);
                });
        } else {
            setMessage('Invalid verification link.');
            setLoading(false);
        }
    }, [location, navigate]);

    return (
        <div className="verify-container">
            <p>Email Verification</p>
            {loading ? <LoadingSpinner /> : <p>{message}</p>}
        </div>
    );
};

export default VerifyEmail;