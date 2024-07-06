import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/Form.css';

const FeedbackForm = () => {
    const [feedbackType, setFeedbackType] = useState('bug');
    const [feedback, setFeedback] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [contactPermission, setContactPermission] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        try {
            const res = await api.post('/api/feedback/', {
                feedback_type: feedbackType,
                feedback,
                name: contactPermission ? name : '',
                email: contactPermission ? email : '',
                contact_permission: contactPermission,
            });
            setSubmitted(true);
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (error) {
            if (error.response) {
                console.log('Error response data:', error.response.data);
                setErrors(error.response.data);
                if (error.response.data.detail) {
                    alert(error.response.data.detail);  // Display general error as alert
                }
            } else if (error.request) {
                alert("Error: No response was received from the server.");
            } else {
                alert("Error: An error occurred while setting up the request.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="container">
                <div className="form-container">
                    <p className="form-title">Thank You!</p>
                    <p>Thank you for your feedback. You will be redirected to the homepage shortly.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            {loading && <LoadingSpinner />}
            <form onSubmit={handleSubmit} className="form-container">
                <p className="form-title">{"Submit Feedback".toUpperCase()}</p>
                <div className="form-group">
                    <select value={feedbackType} onChange={(e) => setFeedbackType(e.target.value)} className="form-input">
                        <option value="bug">Bug</option>
                        <option value="feature">Feature Request</option>
                    </select>
                </div>
                <div className="form-group">
                    <textarea
                        className="form-input"
                        placeholder={feedbackType === 'bug' ? 'Describe the bug you encountered...' : 'Describe the feature you would like to see...'}
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        required
                        rows="7"
                    />
                </div>
                <div className="form-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={contactPermission}
                            onChange={() => setContactPermission(!contactPermission)}
                        />
                        Can we contact you for more details?
                    </label>
                </div>
                {contactPermission && (
                    <>
                        <div className="form-group">
                            <input
                                className="form-input"
                                type="text"
                                placeholder="Your Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required={contactPermission}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                className="form-input"
                                type="email"
                                placeholder="Your Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required={contactPermission}
                            />
                        </div>
                    </>
                )}
                <div className="button-container">
                    <Button className="button cancel" type="button" onClick={() => navigate('/')}>Cancel</Button>
                    <Button className="button submit" type="submit">Submit</Button>
                </div>
            </form>
        </div>
    );
};

export default FeedbackForm;