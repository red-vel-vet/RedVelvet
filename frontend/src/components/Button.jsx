import React from 'react';
import PropTypes from 'prop-types';
import '../styles/Button.css';

function Button({ className, type = 'button', onClick, children }) {
    return (
        <button className={className} type={type} onClick={onClick}>
            {children}
        </button>
    );
}

Button.propTypes = {
    className: PropTypes.string,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    onClick: PropTypes.func,
    children: PropTypes.node.isRequired,
};

export default Button;