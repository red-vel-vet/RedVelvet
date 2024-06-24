import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import "../styles/Form.css";

function LoginRegistrationForm({ route, method }) {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const isLogin = method === "login";
    const name = isLogin ? "Login" : "Register";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Verify email format when registering
        if (!isLogin) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                alert("Please enter a valid email address.");
                setLoading(false); // Stop the loading state
                return; // Prevent the form from submitting
            }
        }

        // Check if it's the registration form and username contains '@'
        if (!isLogin && username.includes('@')) {
            alert("Username cannot be an email address.");
            setLoading(false); // Stop the loading state
            return; // Prevent the form from submitting
        }

        // Check if it's the registration form and passwords match
        if (!isLogin && password !== confirmPassword) {
            alert("Passwords do not match.");
            setLoading(false); // Stop the loading state
            return; // Prevent the form from submitting
        }

        // Check if email is allowed for registration
        const allowedDomain = "@red-vel.vet";
        if ( !email.endsWith(allowedDomain) && !isLogin ) {
            alert("Registration is currently limited to specific email addresses. Please check back later.");
            setLoading(false); // Stop the loading state
            navigate("/"); // Redirect to homepage
            return; // Prevent the form from submitting
        }
        
        try {
            const res = await api.post(route, {email, username, password, confirmPassword})
            if ( isLogin ) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/");
            } else {
                navigate("/login");
            }
        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>{name}</h1>
            {!isLogin && <p style={{ textAlign: 'center'}}>New users not currently being accepted while in development. Please check back!</p>}
            
            {!isLogin && (
                <input
                    className="form-input"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                />
            )}
            <input
                className="form-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={isLogin ? "Email or Username" : "Username"}
            />
            <input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            {!isLogin && (
                <input
                    className="form-input"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                />
            )}
            <button type="submit" className="form-button">
                {name}
            </button>
        </form>
    );
}

export default LoginRegistrationForm;