import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import Modal from "../components/Modal"; // asegurarte de la ruta
type ModalSize = 'small' | 'medium' | 'large';

type ModalState = {
  isOpen: boolean;
  content: ReactNode | null;
  size: ModalSize;
};

type ModalContextType = {
  modal: ModalState;
  openModal: (content: ReactNode, size?: ModalSize) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    content: null,
    size: 'medium',
  });

  const openModal = (content: ReactNode, size: ModalSize = 'medium') => {
    setModal({ isOpen: true, content, size });
  };

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
  };

  return (
    <ModalContext.Provider value={{ modal, openModal, closeModal }}>
      {children}
      <Modal /> {/* Aquí montamos el modal global */}
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
