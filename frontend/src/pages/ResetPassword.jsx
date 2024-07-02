import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';
import Button from '../components/Button';
import '../styles/Form.css';

function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (!token) {
            setMessage('Invalid or missing token.');
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            setLoading(false);
            return;
        }

        try {
            await api.post('/api/user/password-reset/', { token, password });
            setMessage('Password reset successfully. Redirecting to login...');
            setTimeout(() => navigate('/login'), 3000);
        } catch (error) {
            setMessage('Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit} className="form-container">
                <p className="form-title">Reset Password</p>
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
                <div className={`button-container ${!message && 'center'}`}>
                    <Button className="button submit" type="submit" disabled={loading}>
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </Button>
                </div>
                {message && <p>{message}</p>}
            </form>
        </div>
    );
}

export default ResetPassword;