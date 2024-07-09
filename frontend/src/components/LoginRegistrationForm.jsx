import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import Button from './Button';
import LoadingSpinner from './LoadingSpinner';
import '../styles/styles.css';
import "../styles/Form.css";

function LoginRegistrationForm({ route, method }) {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [dob, setDob] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const isLogin = method === "login";
    const name = isLogin ? "Login" : "Register";

    const TottleLoginRegistration = () => {
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

            const disallowedCharactersPattern = /[^\w.-]/; // Allows only letters, numbers, underscores, hyphens, and dots
            if (disallowedCharactersPattern.test(username)) {
                alert("Sorry, but that username is invalid. Usernames may only contain letters, numbers, and the following characters: _ - .");
                setLoading(false);
                return;
            }

            if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/\d/.test(password) || !/[!@#$%^&*]/.test(password)) {
                alert("Password must be at least 8 characters long and contain at least one letter, one number, and one special character.");
                setLoading(false);
                return;
            }

            if (password !== confirmPassword) {
                alert("Passwords do not match.");
                setLoading(false);
                return;
            }

            if (calculateAge(dob) < 21) {
                alert("You must be at least 21 years old to register.");
                setLoading(false);
                return;
            }
        }

        try {
            const res = await api.post(route, { email, username, password, dob });
            if (isLogin) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/user/account");
            } else {
                alert("Please check your email to verify your account.");
                navigate("/login");
            }
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
                <p className="form-title">{name.toUpperCase()}</p>
                {!isLogin && (
                    <>
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
                        <div className="form-group">
                            <input
                                className="form-input"
                                type="date"
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                                placeholder="Date of Birth"
                            />
                            {errors.dob && <p className="error-text">{errors.dob}</p>}
                        </div>
                    </>
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