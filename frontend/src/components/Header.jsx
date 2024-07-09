import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import userIcon from '../assets/icons/user.svg';
import navIcon from '../assets/icons/nav.svg';
import navCloseIcon from '../assets/icons/nav-close.svg';
import '../styles/Header.css';

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <>
            <header className="header">
                <div className="header-left">
                    <img
                        src={navIcon}
                        alt="Navigation Icon"
                        className="header-icon"
                        onClick={toggleMenu}
                    />
                    <h1 className="header-title">RED VELVET</h1>
                </div>
                <div className="header-right">
                    <Link to="/user/account">
                        <img src={userIcon} alt="User Icon" className="header-icon" />
                    </Link>
                </div>
            </header>
            <nav className={`nav-menu ${menuOpen ? 'open' : ''}`}>
                <img
                    src={navCloseIcon}
                    alt="Close Navigation Icon"
                    className="nav-close-icon"
                    onClick={toggleMenu}
                />
                <ul>
                    <li className={location.pathname === '/' ? 'active' : ''}>
                        <Link to="/" onClick={toggleMenu}>Events</Link>
                    </li>
                    <li className={location.pathname === '/feedback' ? 'active' : ''}>
                        <Link to="/feedback" onClick={toggleMenu}>Feedback</Link>
                    </li>
                </ul>
            </nav>
        </>
    );
};

export default Header;