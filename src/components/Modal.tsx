import React from 'react';

interface ModalProps {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = ({ show, onClose, children }: ModalProps) => {
  if (!show) {
    return null;
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Ensure only the overlay triggers the onClose, not the modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={`modal ${show ? 'show' : ''}`} onClick={handleOverlayClick}>
      <div className="modalOverlay">
        {/* Prevent modal content from triggering overlay click */}
        <div className="modalContent" onClick={(e) => e.stopPropagation()}>
          <button className="modalClose" onClick={onClose}>×</button>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
