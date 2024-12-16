import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import navIcon from '../assets/icons/nav.svg';
import navCloseIcon from '../assets/icons/nav-close.svg';
import guestsStyles from '../styles/Guests.module.css'; 
import hostsStyles from '../styles/Hosts.module.css';   
import '../styles/Header.css';  

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    const isHostsPage = location.pathname.startsWith('/hosts');
    const currentStyles = isHostsPage ? hostsStyles : guestsStyles;

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <>
            <header className={`${currentStyles.header} header`}>
                <div className={`${currentStyles.headerLeft} header-left`}>
                    <h1 className={`${currentStyles.headerTitle} header-title`}>RED VELVET</h1>
                </div>
                <div className="header-right">
                    <img
                        src={navIcon}
                        alt="Navigation Icon"
                        className={`${currentStyles.headerIcon} header-icon`}
                        onClick={toggleMenu}
                    />
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
                        <Link to="/" onClick={toggleMenu}>Home</Link>
                    </li>
                    <li className={location.pathname === '/guests/events' ? 'active' : ''}>
                        <Link to="/guests/events" onClick={toggleMenu}>Events</Link>
                    </li>
                    <li className={location.pathname === '/guests/profile' ? 'active' : ''}>
                        <Link to="/guests/profile" onClick={toggleMenu}>Profile</Link>
                    </li>
                </ul>
            </nav>
        </>
    );
};

export default Header;