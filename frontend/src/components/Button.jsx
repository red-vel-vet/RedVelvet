import React from 'react';
import PropTypes from 'prop-types';
import buttonStyles from '../styles/Button.module.css'; 

function Button({ variant = 'default', type = 'button', onClick, disabled = false, children }) {
    const buttonClass = `${buttonStyles.button} ${buttonStyles[variant]} ${disabled ? buttonStyles.inactive : ''}`;

    return (
        <button
            className={buttonClass}
            type={type}
            onClick={onClick}
            disabled={disabled} 
        >
            {children}
        </button>
    );
}

Button.propTypes = {
    variant: PropTypes.oneOf(['submit', 'cancel', 'default', 'takeover']),
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    children: PropTypes.node.isRequired,
};

export default Button;