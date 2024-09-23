import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';
import '../styles/Guests.css';
import "../styles/Form.css";

function LoginRegistrationForm({ route, method }) {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [dob, setDob] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const isLogin = method === "login";
    const name = isLogin ? "Login" : "Register";

    const toggleLoginRegistration = () => {
        const currentPath = window.location.pathname;
        if (currentPath.includes('/login')) {
            navigate('/register'); // Redirect to register if on login
        } else if (currentPath.includes('/register')) {
            navigate('/login'); // Redirect to login if on register
        }
    };

    const calculateAge = (dob) => {
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        if (!isLogin) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                alert(`Sorry, but ${email} is not a valid email address.`);
                setLoading(false);
                return;
            }

            if (calculateAge(dob) < 18) {
                alert("You must be at least 18 years old to register.");
                setLoading(false);
                return;
            }
        }

        try {
            const res = await api.post(route, { email, username, dob });
            if (isLogin) {
                alert("Please check your email to log in.");
            } else {
                alert("Please check your email to verify your account.");
                navigate("/login");
            }
            // Redirect to EmailLogin page after email is sent
            navigate('/email-login');
        } catch (error) {
            if (error.response) {
                console.log('Error response data:', error.response.data);
                setErrors(error.response.data);
                if (error.response.data.detail) {
                    alert(error.response.data.detail);  // Display general error as alert
                }
                if (error.response.data.non_field_errors) {
                    alert(error.response.data.non_field_errors[0]);  // Display non-field error as alert
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

    return (
        <div className="container">
            {loading && <LoadingSpinner />}
            <form onSubmit={handleSubmit} className="form-container">
                <p className="form-title">{name}</p>
                <div className="form-group">
                    <input
                        className="form-input"
                        id="email"
                        type="email"
                        autocomplete="email"
                        value={email.toLowerCase()}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address"
                        required
                    />
                    {errors.email && <p className="error-text">{errors.email}</p>}
                </div>
                {!isLogin && (
                    <>
                        <div className="form-group">
                            <input
                                className="form-input"
                                id="email-confirm"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Username"
                                required
                            />
                            {errors.username && <p className="error-text">{errors.username}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="dob" className={`form-label ${dob ? 'has-value' : ''}`}>
                                Date of Birth
                            </label>
                            <input
                                className="form-input"
                                type="date"
                                id="dob"
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                                required
                            />
                            {errors.dob && <p className="error-text">{errors.dob}</p>}
                        </div>
                    </>
                )}
                <div className="button-container">
                    <Button
                        className="button cancel switch lr-button"
                        type="button"
                        onClick={toggleLoginRegistration}
                    >
                        {isLogin ? 'Switch to Register' : 'Switch to Login'}
                    </Button>
                    <Button className="button submit lr-button" type="submit">
                        {isLogin ? 'Login' : 'Register'}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default LoginRegistrationForm;