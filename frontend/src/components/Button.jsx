import React from 'react';
import PropTypes from 'prop-types';
import '../styles/Button.css';

function Button({ className, onClick, children }) {
    return (
        <button className={className} onClick={onClick}>
            {children}
        </button>
    );
}

Button.propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
};

export default Button;