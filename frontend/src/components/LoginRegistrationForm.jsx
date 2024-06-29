import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import Button from './Button';
import '../styles/styles.css'; 
import "../styles/Form.css";

function LoginRegistrationForm({ route, method }) {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const isLogin = method === "login";
    const name = isLogin ? "Login" : "Register";

    const TottleLoginRegistration = () => {
        // Assuming you have access to the current location/path
        const currentPath = window.location.pathname;
        if (currentPath.includes('/login')) {
            navigate('/register'); // Redirect to register if on login
        } else if (currentPath.includes('/register')) {
            navigate('/login'); // Redirect to login if on register
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});  // Reset errors before submission

        // Verify email format when registering
        if (!isLogin) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                alert(`Sorry, but ${email} is not a valid email address.`);
                setLoading(false); // Stop the loading state
                return; // Prevent the form from submitting
            }
        }

        // Check if it's the registration form and the username contains disallowed characters
        if (!isLogin) {
            const disallowedCharactersPattern = /[^\w.-]/; // Allows only letters, numbers, underscores, hyphens, and dots
            if (disallowedCharactersPattern.test(username)) {
                alert("Sorry, but that username is invalid. Usernames may only contain letters, numbers, and the following characters: _ - .");
                setLoading(false); // Stop the loading state
                return; // Prevent the form from submitting
            }
        }

        // Check if it's the registration form and password too short, and has chars, numbers, and symbols
        if (!isLogin && (password.length < 8 || !/[a-zA-Z]/.test(password) || !/\d/.test(password) || !/[!@#$%^&*]/.test(password))) {
            alert("Password must be at least 8 characters long and contain at least one letter, one number, and one special character.");
            setLoading(false); // Stop the loading state
            return; // Prevent the form from submitting
        }

        // Check if it's the registration form and passwords match
        if (!isLogin && password !== confirmPassword) {
            alert("Passwords do not match.");
            setLoading(false); // Stop the loading state
            return; // Prevent the form from submitting
        }
        
        try {
            const res = await api.post(route, { email, username, password });
            if (isLogin) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/");
            } else {
                navigate("/login");
            }
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                setErrors(error.response.data);
            } else if (error.request) {
                // The request was made but no response was received
                alert("Error: No response was received from the server.");
            } else {
                // Something happened in setting up the request that triggered an Error
                alert("Error: An error occurred while setting up the request.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className = "container">
            <form onSubmit={handleSubmit} className="form-container">
                <p class="form-title">{name.toUpperCase()}</p>
                {!isLogin && (
                    <div className="form-group">
                        <input
                            className="form-input"
                            type="text"
                            value={email.toLowerCase()}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email Address"
                        />
                        {errors.email && <p className="error-text">{errors.email}</p>}
                    </div>
                )}
                <div className="form-group">
                    <input
                        className="form-input"
                        type="text"
                        value={username.toLowerCase()}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder={isLogin ? "Email or Username" : "Username"}
                    />
                    {errors.username && <p className="error-text">{errors.username}</p>}
                </div>
                <div className="form-group">
                    <input
                        className="form-input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                    {errors.password && <p className="error-text">{errors.password}</p>}
                </div>
                {!isLogin && (
                    <div className="form-group">
                        <input
                            className="form-input"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm Password"
                        />
                    </div>
                )}
                <div className="button-container">
                        <Button
                            className="button cancel switch"
                            type="button"
                            onClick={TottleLoginRegistration}
                        >
                            {isLogin ? 'Switch to Register' : 'Switch to Login'}
                        </Button>
                        <Button className="button submit" type="submit">
                            {isLogin ? 'Login' : 'Register'}
                        </Button>
                    </div>
            </form>
        </div>
    );
}

export default LoginRegistrationForm;