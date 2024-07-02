import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/Form.css';

function Account() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get('/api/user/view/');
                setUser(response.data);
            } catch (error) {
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [navigate]);

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <>
        <div className="container">
            <div className="form-container">
                <p className="form-title">ACCOUNT INFORMATION</p>
                <div className="form-group">
                    <p>Username: {user?.username}</p>
                    <p>Email: {user?.email}</p>
                </div>
                <div className="button-container">
                    <Button 
                        className="button submit"
                        type="button"
                        onClick={() => navigate('/')}
                    >
                        Back to Home
                    </Button>
                    <Button 
                        className="button submit"
                        type="button"
                        onClick={() => navigate('/reset-password')}
                    >
                        Reset Password
                    </Button>
                </div>
            </div>
        </div>
        <div style={{ textAlign: 'center', margin: '85px 50px' }}>
            <Link to="/logout" style={{ color: '#FDF3E7', textDecoration: 'none' }}>
                Logout
            </Link>
        </div>
    </>
    );
}

export default Account;