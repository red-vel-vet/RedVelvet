import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/EmailLogin.css';

function EmailLogin() {
    return (
        <div className="container">
            <div className="form-container">
                <h1 className="form-title">Email Sent.</h1>
                <p>Please check your email to log in or verify your account.</p>
            </div>
        </div>
    );
}

export default EmailLogin;