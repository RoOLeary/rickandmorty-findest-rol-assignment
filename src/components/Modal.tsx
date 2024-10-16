/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/ban-ts-comment */


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
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`modal ${show ? "show" : ""}`}
      onClick={handleOverlayClick}
      // @ts-ignore
      onTouchStart={handleOverlayClick}
    >
      <div className="modalOverlay">
        <div
          className="modalContent"
          onClick={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          <button className="modalClose" onClick={onClose}>
            ×
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
