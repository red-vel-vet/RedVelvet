import React from 'react';
import Header from './Header';
import '../styles/styles.css'; 

const Layout = ({ children }) => (
    <>
        <Header />
        <main>{children}</main>
    </>
);

export default Layout;