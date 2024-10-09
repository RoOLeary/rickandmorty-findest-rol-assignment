import React from 'react';

interface ModalProps {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = ({ show, onClose, children }:ModalProps) => {
  if (!show) return null;

  return (
    <div className='modal'>
        <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={onClose}>Close</button>
            {children}
        </div>
        </div>
    </div>
  );
};

export default Modal;

