import React from 'react';
import UserNavFooter from './UserNavFooter';
import styles from '../styles/HostNavFooter.module.css'; 
import eventsIcon from '../assets/icons/host_nav/events.svg';
import inviteIcon from '../assets/icons/host_nav/invite.svg';
import membersIcon from '../assets/icons/host_nav/members.svg';
import profileIcon from '../assets/icons/host_nav/profile.svg';

const HostNavFooter = () => {
    const hostNavItems = [
        { link: '/hosts/profile', icon: profileIcon, label: 'Profile' },
        { link: '/hosts/events', icon: eventsIcon, label: 'Events' },
        { link: '/hosts/invite', icon: inviteIcon, label: 'Invite' },
        { link: '/hosts/members', icon: membersIcon, label: 'Members' },
    ];

    return (
        <UserNavFooter 
            navItems={hostNavItems} 
            className={styles} 
        />
    );
};

export default HostNavFooter;
