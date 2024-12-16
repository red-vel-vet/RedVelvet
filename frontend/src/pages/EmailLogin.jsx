import React from 'react';
import formStyles from '../styles/Form.module.css'; 

function EmailLogin() {
    return (
        <div className={formStyles.container}>
            <div className={formStyles.formContainer}>
                <h2 className={formStyles.formTitle}>Email Sent</h2>
                <p className={formStyles.formMessage}>Please check your email to log in or verify your account.</p>
            </div>
        </div>
    );
}

export default EmailLogin;