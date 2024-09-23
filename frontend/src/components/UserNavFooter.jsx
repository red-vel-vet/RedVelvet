import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/UserNavFooter.css';
import accountIcon from '../assets/icons/user_nav/account.svg';
import profileIcon from '../assets/icons/user_nav/profile.svg';
import quizIcon from '../assets/icons/user_nav/quiz.svg';
import connectionsIcon from '../assets/icons/user_nav/connections.svg';

const Footer = () => {
  return (
    <div className="user-nav-footer">
      <NavLink to="/user/account" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <img src={accountIcon} alt="Account" />
        <span>Account</span>
      </NavLink>
      <NavLink to="/user/profile" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <img src={profileIcon} alt="Profile" />
        <span>Profile</span>
      </NavLink>
      <NavLink to="/user/quiz" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <img src={quizIcon} alt="Quiz" />
        <span>Quiz</span>
      </NavLink>
      <NavLink to="/user/connections" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <img src={connectionsIcon} alt="Connections" />
        <span>Connections</span>
      </NavLink>
    </div>
  );
};

export default Footer;