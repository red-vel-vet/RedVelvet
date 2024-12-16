import React from 'react';
import UserNavFooter from './UserNavFooter';
import styles from '../styles/GuestNavFooter.module.css'; 
import eventsIcon from '../assets/icons/guest_nav/events.svg';
import matchIcon from '../assets/icons/guest_nav/match.svg';
import connectionsIcon from '../assets/icons/guest_nav/connections.svg';
import profileIcon from '../assets/icons/guest_nav/profile.svg';

const GuestNavFooter = () => {
    const guestNavItems = [
        { link: '/guests/events', icon: eventsIcon, label: 'Events' },
        { link: '/guests/match', icon: matchIcon, label: 'Match' },
        { link: '/guests/connections', icon: connectionsIcon, label: 'Connections' },
        { link: '/guests/profile', icon: profileIcon, label: 'Profile' },
    ];

    return (
        <UserNavFooter 
            navItems={guestNavItems} 
            className={styles} 
        />
    );
};

export default GuestNavFooter;
