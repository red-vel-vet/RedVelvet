import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/Form.css';

function ResetPassword() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const isReset = Boolean(token);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            setLoading(false);
            return;
        }

        try {
            if (isReset) {
                await api.post('/api/user/password-reset/', { token, password });
                setMessage('Password reset successfully.');
                setTimeout(() => {
                    setLoading(false);
                    navigate('/login');
                }, 1000); // Short delay before redirecting
            } else {
                await api.post('/api/user/change-password/', { currentPassword, password });
                setMessage('Password changed successfully.');
                setTimeout(() => {
                    setLoading(false);
                    navigate('/');
                }, 1000); // Short delay before redirecting
            }
        } catch (error) {
            setMessage('Failed to reset/change password. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="container">
            {loading && <LoadingSpinner />}
            <form onSubmit={handleSubmit} className="form-container">
                <p className="form-title">{isReset ? 'Reset Password' : 'Change Password'}</p>
                {!isReset && (
                    <div className="form-group">
                        <input
                            className="form-input"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Current Password"
                            required
                        />
                    </div>
                )}
                <div className="form-group">
                    <input
                        className="form-input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="New Password"
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        className="form-input"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm New Password"
                        required
                    />
                </div>
                <div className="button-container">
                    {!isReset && (
                        <Button 
                            className="button cancel" 
                            type="button" 
                            onClick={() => navigate('/')}
                        >
                            Back to Home
                        </Button>
                        )}
                    <Button className="button submit" type="submit" disabled={loading}>
                        {loading ? (isReset ? 'Resetting...' : 'Changing...') : (isReset ? 'Reset Password' : 'Change Password')}
                    </Button>
                </div>
                {message && <p>{message}</p>}
            </form>
        </div>
    );
}

export default ResetPassword;