import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants'; // Import your token keys
import formStyles from '../styles/Form.module.css'; 

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
                    // Use constants to store tokens in localStorage
                    localStorage.setItem(ACCESS_TOKEN, response.data.access);
                    localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
                    setMessage('Success! Redirecting...');
                    setLoading(false);
                    // Redirect to events page after a short delay
                    setTimeout(() => {
                        navigate('/');
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
        <div className={formStyles.container}>
            <div className={formStyles.formContainer}>
                <h2 className={formStyles.formTitle}>Email Verification</h2>
                {loading ? <LoadingSpinner /> : <p className={formStyles.formMessage}>{message}</p>}
            </div>
        </div>
    );
};

export default VerifyEmail;