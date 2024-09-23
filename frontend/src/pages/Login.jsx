import React from 'react';
import Layout from '../components/Layout';
import LoginRegistrationForm from "../components/LoginRegistrationForm";

function Login() {
    return (
        <Layout>
            <LoginRegistrationForm route="/api/login-request/" method="login" />
        </Layout>
    );
}

export default Login;