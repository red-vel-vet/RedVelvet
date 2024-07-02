import React from 'react';
import { Link } from 'react-router-dom';
import LoginRegistrationForm from "../components/LoginRegistrationForm";

function Login() {
    return (
        <div>
            <LoginRegistrationForm route="/api/token/" method="login" />
            <div style={{ textAlign: 'center', margin: '85px 50px'}}>
                <Link to="/forgot-password" style={{ color: '#FDF3E7', textDecoration: 'none' }}>
                    Forgot your password?
                </Link>
            </div>
        </div>
    );
}

export default Login;