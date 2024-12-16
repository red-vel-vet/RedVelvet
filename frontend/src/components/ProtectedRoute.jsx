import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ensure the correct default import for jwtDecode
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useState, useEffect } from "react";
import LoadingSpinner from './LoadingSpinner';

function ProtectedRoute({ component: Component }) {
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        const authenticate = async () => {
            try {
                const token = localStorage.getItem(ACCESS_TOKEN);
                if (!token) {
                    setIsAuthorized(false);
                    return;
                }

                const decoded = jwtDecode(token);
                const now = Math.floor(Date.now() / 1000); // Convert to seconds

                // Check if token is about to expire (allow a 60-second buffer)
                if (decoded.exp < now - 60) {
                    await refreshToken();
                } else {
                    setIsAuthorized(true);
                }
            } catch (error) {
                console.error(error);
                setIsAuthorized(false);
            }
        };

        authenticate();
    }, []);

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        if (!refreshToken) {
            setIsAuthorized(false);
            return;
        }
        try {
            const res = await api.post("/api/token/refresh/", { refresh: refreshToken });
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
            }
        } catch (error) {
            console.error(error);
            setIsAuthorized(false);
        }
    };

    // Show loading spinner while checking auth state
    if (isAuthorized === null) {
        return <LoadingSpinner />;
    }

    // If authorized, render the component; otherwise, redirect to login
    return isAuthorized ? <Component /> : <Navigate to="/login" />;
}

export default ProtectedRoute;