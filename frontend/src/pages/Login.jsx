import LoginRegistrationForm from "../components/LoginRegistrationForm";

function Login() {
    return <LoginRegistrationForm route="/api/token/" method="login" />;
}

export default Login;