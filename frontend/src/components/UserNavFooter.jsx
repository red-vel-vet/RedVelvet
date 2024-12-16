import React from 'react';
import baseStyles from '../styles/UserNavFooter.module.css';

const UserNavFooter = ({ navItems, className }) => {
    return (
        <footer className={`${baseStyles.userNavFooter} ${className.guestFooter}`}>
            {navItems.map(({ link, icon, label }) => (
                <a href={link} key={label} className={`${baseStyles.navItem} ${className.navItem}`}>
                    <img src={icon} alt={`${label} icon`} className={className.icon} />
                    <span>{label}</span>
                </a>
            ))}
        </footer>
    );
};

export default UserNavFooter;