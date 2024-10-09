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

  const handleOverlayClick = () => {
    onClose();
  };

  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); // Prevent click from closing the modal when clicking inside the modal content
  };

  return (
    <div className={`modal ${show ? 'show' : ''}`} onClick={handleOverlayClick}>
      <div className="modalOverlay">
        <div className="modalContent" onClick={handleContentClick}>
          <button className="modalClose" onClick={onClose}>×</button>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
