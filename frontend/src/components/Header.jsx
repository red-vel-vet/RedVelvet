// Header.jsx
import React from 'react';
import logo from '../assets/images/token.png';
import '../styles/Header.css';

const Header = () => (
    <header className="header">
        <img src={logo} alt="Red Velvet Icon" className="logo" />
        <h1 className="title">RED VELVET</h1>
    </header>
);

export default Header;