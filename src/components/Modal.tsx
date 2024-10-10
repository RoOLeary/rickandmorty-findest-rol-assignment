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
    if (e.target === e.currentTarget) {  // Ensure it's the overlay being clicked
      onClose();  // Close the modal when clicking the overlay
    }
  };

  return (
    <div className={`modal ${show ? 'show' : ''}`} onClick={handleOverlayClick}>
      <div className="modalOverlay">
        <div className="modalContent">
          <button className="modalClose" onClick={onClose} data-testid="modal-close">X</button>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
