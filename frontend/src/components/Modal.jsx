import React, { useEffect } from 'react';
import modalStyles from '../styles/Modal.module.css';

/**
 * Universal modal component:
 * - Covers the entire viewport (full-screen overlay).
 * - Contains an outer container (`outerModal`) where you can
 *   absolutely position header, scroll area, and footer.
 * - backgroundStyle can be "translucent" for a black 50% overlay,
 *   otherwise defaults to solid white.
 */
function Modal({ isOpen, onClose, backgroundStyle, children }) {
  // Prevent background scrolling when the modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // If not open, render nothing
  if (!isOpen) return null;

  // Close the modal if the user clicks directly on the overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const overlayClass =
    backgroundStyle === 'translucent'
      ? modalStyles.overlayTranslucent
      : modalStyles.overlay;

  return (
    <div className={overlayClass} onClick={handleOverlayClick}>
      <div className={modalStyles.outerModal}>
        {children}
      </div>
    </div>
  );
}

export default Modal;