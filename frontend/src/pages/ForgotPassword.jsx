import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Button from '../components/Button';
import '../styles/Form.css';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await api.post('/api/user/password-reset-request/', { email });
            setMessage(response.data.message);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.log('Email does not exist in the system.');
            } else {
                console.log('An error occurred:', error);
            }
            setMessage('Failed to send password reset link. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit} className="form-container">
                <p className="form-title">Forgot Password</p>
                <div className="form-group">
                    <input
                        className="form-input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address"
                        required
                    />
                </div>
                <div className="button-container">
                    <Button className="button submit" type="submit" disabled={loading}>
                        {loading ? 'Sending...' : 'Reset'}
                    </Button>
                    <Button 
                        className="button cancel" 
                        type="button" 
                        onClick={() => navigate('/login')}
                    >
                        Back to Login
                    </Button>
                </div>
                {message && <p className="email-sent">{message}</p>}
            </form>
        </div>
    );
}

export default ForgotPassword;