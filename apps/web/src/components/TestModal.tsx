import { useModal } from "../context/ModalContext"

export default function TestModal() {
  const { openModal } = useModal()

  return (
    <button onClick={() => openModal(<div style={{ padding: "20px" }}>¡Hola desde el Modal!</div>, "medium")}>
      Abrir Modal de Prueba
    </button>
  )
}
