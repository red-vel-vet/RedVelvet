import React from 'react';
import LoginRegistrationForm from "../components/LoginRegistrationForm";

function Login() {
    return (
        <div>
            <LoginRegistrationForm route="/api/login-request/" method="login" />
        </div>
    );
}

export default Login;