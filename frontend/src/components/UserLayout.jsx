import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import UserNavFooter from './UserNavFooter';

const UserLayout = () => {
  const location = useLocation();
  return (
    <div className="user-layout">
      <Outlet />
      {location.pathname.startsWith('/user') && <UserNavFooter />}
    </div>
  );
};

export default UserLayout;