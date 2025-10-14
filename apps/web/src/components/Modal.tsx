import React from "react";
import { useModal } from "../context/ModalContext";
import "./Modal.css"; // archivo de estilos

const Modal: React.FC = () => {
  const { modal, closeModal } = useModal();

  if (!modal.isOpen) return null;

  let width;
  switch (modal.size) {
    case 'small':
      width = '300px';
      break;
    case 'medium':
      width = '500px';
      break;
    case 'large':
      width = '800px';
      break;
    default:
      width = '500px';
  }

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div
        className="modal-content"
        style={{ width }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={closeModal}>×</button>
        {modal.content}
      </div>
    </div>
  );
};

export default Modal;