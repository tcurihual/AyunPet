import React from "react";
import { useModal } from "../context/ModalContext";
import "./Modal.css"; // archivo de estilos

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}


const Modal: React.FC<ModalProps> = ({ children, isOpen, onClose }) => {

  if (!isOpen) return null;

  
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
