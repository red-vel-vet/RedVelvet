import React from 'react';
import '../styles/styles.css'; 
import Header from './Header';

const Layout = ({ children }) => (
    <>
        <Header />
        <main className="content-area">{children}</main>
    </>
);

export default Layout;