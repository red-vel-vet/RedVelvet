import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';
import '../styles/VerifyEmail.css';

const VerifyEmail = () => {
    const [message, setMessage] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');

        if (token) {
            api.post('/api/verify-email/', { token })
                .then(response => {
                    console.log(response.data.message);
                    setMessage(response.data.message);
                    // Optionally redirect to login after a delay
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000);
                })
                .catch(error => {
                    console.log(error);
                    setMessage('Email verification failed. Please try again.');
                });
        } else {
            setMessage('Invalid verification link.');
        }
    }, [location, navigate]);

    return (
        <div className="verify-container">
            <p>Email Verification</p>
            <p>{message}</p>
        </div>
    );
};

export default VerifyEmail;