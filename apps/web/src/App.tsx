import { ModalProvider } from "./context/ModalContext"
import TestModal from "./components/TestModal"
import "./App.css"

function App() {
  return (
    <ModalProvider>
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>Ayün Pet</h1>
        <p>¡Bienvenido a la aplicación de adopción de mascotas!</p>
        <TestModal />
      </div>
    </ModalProvider>
  )
}

export default App
