import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import Header from './Header';
import GuestNavFooter from './GuestNavFooter';
import HostNavFooter from './HostNavFooter';
import '../styles/styles.css';

const Layout = ({ children, isProtected }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkTokenExpiry = () => {
      const accessToken = localStorage.getItem(ACCESS_TOKEN);
      const refreshToken = localStorage.getItem(REFRESH_TOKEN);

      if (!accessToken || !refreshToken) {
        if (isProtected) {
          navigate('/login', { state: { from: location.pathname } });
        }
        return;
      }

      const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
      const expirationTime = tokenPayload.exp * 1000;
      const currentTime = Date.now();

      if (expirationTime - currentTime < 5 * 60 * 1000) {
        refreshAccessToken(refreshToken);
      }
    };

    const refreshAccessToken = async (refreshToken) => {
      try {
        const response = await api.post('/api/token/refresh/', { refresh: refreshToken });
        localStorage.setItem(ACCESS_TOKEN, response.data.access);
      } catch (error) {
        console.log('Token refresh failed:', error);
        if (isProtected) {
          navigate('/login', { state: { from: location.pathname } });
        }
      }
    };

    checkTokenExpiry();
  }, [isProtected, location, navigate]);

  const isGuestPath = location.pathname.startsWith('/guests');
  const isHostPath = location.pathname.startsWith('/hosts');

  return (
    <div id="root">
      <Header />
      <main className="content-area">{children}</main>
      {isGuestPath && <GuestNavFooter />}
      {isHostPath && <HostNavFooter />}
    </div>
  );
};

export default Layout;
