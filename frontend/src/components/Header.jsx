import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import navIcon from '../assets/icons/nav.svg';
import navCloseIcon from '../assets/icons/nav-close.svg'; 
import '../styles/styles.css' 
import headerStyles from '../styles/Header.module.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Determine if it's a host page
  const isHostPage = location.pathname.startsWith('/hosts');
  const headerClass = isHostPage ? headerStyles.hostHeader : headerStyles.guestHeader;

  return (
    <>
      <header className={`${headerStyles.headerContainer} ${headerClass}`}>
        <div>
          <h1>RED VELVET</h1>
        </div>
        <div>
          <img
            src={navIcon}
            alt="Navigation Icon"
            className={headerStyles.headerIcon}
            onClick={toggleMenu}
          />
        </div>
      </header>

      <nav className={`${headerStyles.navMenu} ${menuOpen ? headerStyles.open : ''}`}>
        <img
          src={navCloseIcon}
          alt="Close Navigation Icon"
          className={headerStyles.navCloseIcon}
          onClick={toggleMenu}
        />
        <ul>
          <li className={location.pathname === '/' ? headerStyles.active : ''}>
            <Link to="/" onClick={toggleMenu}>Home</Link>
          </li>
          <li className={location.pathname === '/guests/events' ? headerStyles.active : ''}>
            <Link to="/guests/events" onClick={toggleMenu}>Events</Link>
          </li>
          <li className={location.pathname === '/guests/profile' ? headerStyles.active : ''}>
            <Link to="/guests/profile" onClick={toggleMenu}>Profile</Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Header;
